#
#
# 
#
#
#----------------------------------------eje08firsttake.py---------------------------------------

from pyspark import SparkConf, SparkContext
from pyspark.sql import SparkSession

spark = SparkSession\
        .builder\
        .appName("Ejemplo-08")\
        .master("spark://172.18.0.2:7077")\
        .getOrCreate()

sc = spark.sparkContext

lines = sc.textFile("/home/EjemplosSpark01/in/book.txt")
firstLine = lines.first()

print("First Line: %s" % firstLine)

threelines = lines.take(3)

for line in threelines:
	print("--> %s" % line)

