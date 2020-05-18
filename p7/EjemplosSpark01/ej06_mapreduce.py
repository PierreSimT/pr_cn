#
#----------------------------------------ej06_mapreduce.py---------------------------------------

from pyspark import SparkConf, SparkContext

conf = (SparkConf()
         .setMaster("local")
         .setAppName("My app")
         .set("spark.executor.memory", "1g"))

sc = SparkContext(conf = conf)

rdd = sc.parallelize([1, 1, 1, 1, 2, 2, 2, 3, 3, 4])
print("RDD original:  %s" % (rdd.collect()))

rdd2 = rdd.map(lambda x: x*x)
print("Cuadrado de los elementos del RDD: %s" % (rdd2.collect()))

tSum = rdd2.reduce(lambda x, y: x+y)
print("La suma del producto total es: %i" %  (tSum))
