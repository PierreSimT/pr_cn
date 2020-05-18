#
#
# Tutorialspoint - PySpark; Learn Pyspark
#
# ----------------------------------------count.py---------------------------------------
from pyspark.sql import SparkSession
# sc = SparkContext("local", "count app")

spark = SparkSession\
        .builder\
        .appName("Ej01-Count")\
        .master("spark://172.18.0.2:7077")\
        .getOrCreate()

sc = spark.sparkContext

words = sc.parallelize (
   ["scala", 
   "java", 
   "hadoop", 
   "spark", 
   "akka",
   "spark vs hadoop", 
   "pyspark",
   "pyspark and spark"]
)
counts = words.count()
print("Number of elements in RDD -> %i" % (counts))