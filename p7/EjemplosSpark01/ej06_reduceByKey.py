#
#
# Tutorialspoint - PySpark; Learn Pyspark; https://www.tutorialspoint.com/pyspark/pyspark_rdd.htm
# http://www.diegocalvo.es/operaciones-mapreduce-con-rdds-apache-spark-en-python/
#
#----------------------------------------ej06_reduceByKey.py---------------------------------------
from pyspark import SparkContext
sc = SparkContext("local", "Map app")
words = sc.parallelize (
   ["red",
   "red",
   "blue",
   "blue",
   "green",
   "red",
   "green",
   "yellow"]
)
words_map = words.map(lambda x: (x, 1)) # Se crea un diccionario (x, 1)
mapping = words_map.collect()

print("Key value pair -> %s" % (mapping))

addedelements = words_map.reduceByKey(lambda x,y: x+y) # Se reduce mediante suma en funcion de la clave

print("Key value pair reduced by Key-> %s" % (addedelements.collect()))


