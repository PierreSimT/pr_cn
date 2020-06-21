import socket
import sys
import requests
import json

def get_countries():
    url = 'https://api.covid19api.com/countries'
    query_url = url
    response = requests.get(query_url, stream=True)
    # print(response.json())
    return response

def get_data_all_countries(countries_data):
    for line in countries_data:
        country_name = line['Slug'] # Muestra el nombre del pais que va en la direccion API
        url_country = 'https://api.covid19api.com/total/country/' + country_name
        response_country = requests.get(url_country)
        print(response_country.json())

get_data_all_countries(get_countries().json())
