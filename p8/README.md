## Práctica 8 - Spark Streaming

Dos componentes

* Server (FLASK) que lee la API del CoVID para todos los países 
* Spark Streaming que obtiene los datos del server mediante socket y va separando datos

URLs de interes: 

* Obtencion de paises: https://api.covid19api.com/countries
* Obtencion de datos totales por pais: https://api.covid19api.com/total/country/spain