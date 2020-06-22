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

def get_data_all_countries(countries_data, tcp_connection=None):
    for line in countries_data:
        country_name = line['Slug'] # Muestra el nombre del pais que va en la direccion API
        url_country = 'https://api.covid19api.com/total/country/' + country_name
        response_country = requests.get(url_country)
        response_json = response_country.json()
        if len(response_json) > 1:
            latest_country_data = response_json[-1]
            
            data = json.dumps(latest_country_data) + '\n'
            byt = data.encode()
            print(data)
            tcp_connection.send(byt)


# def send_to_spark(http_resp, tcp_connection):
#     for line in http_resp.iter_lines():
#         try:
#             full_tweet = json.loads(line)
#             tweet_text = full_tweet['text']
#             print("Tweet Text: " + tweet_text)
#             print ("------------------------------------------")
#             tcp_connection.send(tweet_text + '\n')
#         except:
#             e = sys.exc_info()[0]
#             print("Error: %s" % e)

TCP_IP = '0.0.0.0'
TCP_PORT = 9009
conn = None

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((TCP_IP, TCP_PORT))
s.listen(1)
print("Waiting for TCP connection...")
conn, addr = s.accept()
print("Connected... Starting getting tweets.")
resp = get_countries().json()
get_data_all_countries(resp, conn)