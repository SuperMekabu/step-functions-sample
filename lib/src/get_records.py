import csv
import logging
import os

import boto3
import requests as requests
from botocore.exceptions import ClientError

from PokeUrl import PokeUrl

API_URL = "https://pokeapi.co/api/v2/type/"


def handler(event, context):
    res = requests.get(API_URL + "1")
    res_json = res.json()
    pokemons = map(lambda poke: PokeUrl(poke["pokemon"]["name"], poke["pokemon"]["url"]),
                   res_json["pokemon"])
    with open("/tmp/pokemons.txt", "w", newline="") as file:
        writer = csv.writer(file, delimiter=",", quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerows(map(lambda poke: [poke.get_name(), poke.get_url()], pokemons))

    s3_client = boto3.client("s3", region_name="ap-northeast-1")
    bucket_name = os.environ["BUCKET_NAME"]
    if bucket_name is None:
        raise Exception("BUCKET_NAME is not set")
    try:
        s3_client.upload_file("/tmp/pokemons.txt", bucket_name, "pokemons.txt")
    except ClientError as e:
        logging.error(e)
        raise e
    os.remove("/tmp/pokemons.txt")

    return {
        "statusCode": 200,
        "bucketName": bucket_name,
        "fileName": "pokemons.txt",
    }


handler(None, None)
