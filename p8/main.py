from __future__ import print_function

import sys
import json

from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import Row, SparkSession


def getSparkSessionInstance(sparkConf):
    if ('sparkSessionSingletonInstance' not in globals()):
        globals()['sparkSessionSingletonInstance'] = SparkSession\
            .builder\
            .config(conf=sparkConf)\
            .getOrCreate()
    return globals()['sparkSessionSingletonInstance']


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: main.py <hostname> <port> ", file=sys.stderr)
        sys.exit(-1)
    host, port = sys.argv[1:]
    sc = SparkContext(appName="PythonSqlNetworkWordCount")
    ssc = StreamingContext(sc, 3)
    ssc.checkpoint("checkpoint_exampleApp")

    # Create a socket stream on target ip:port and count the
    # words in input stream of \n delimited text (eg. generated by 'nc')
    country_stream = ssc.socketTextStream(host, int(port))

    def incredibleFunction(line):
        data = json.loads(line[0])
        return Row(Country=data['Country'], Confirmed=data['Confirmed'], Deaths=data['Deaths'], Active=data['Active'])

    def readMyStream (rdd):
        spark = getSparkSessionInstance(rdd.context.getConf())
        if not rdd.isEmpty():
            df = spark.read.json(rdd)
            print('Started the Process')
            print('Selection of Columns')
            rowRdd = rdd.map(lambda w: incredibleFunction(w))
            df = spark.createDataFrame(rowRdd)
            df.registerTempTable("covid")
            covidDataframe = spark.sql("select Country, Confirmed, Deaths, Active from covid")
            covidDataframe.show()
    
    def aggregate_tags_count(new_values, total_sum):
        	return sum(new_values) + (total_sum or 0)

    country_stream_1 = country_stream.map(lambda x: (x, 1))
    country_stream_2 = country_stream_1.updateStateByKey(aggregate_tags_count)
    country_stream_2.foreachRDD( lambda rdd: readMyStream(rdd) )
    
    ssc.start()
    ssc.awaitTermination()