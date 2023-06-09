import csv
import os
import random

import boto3
import requests

from PokeUrl import PokeUrl
from Pokemon import Pokemon


def handler(event, context):
    bucket_name = event["bucketName"]
    file_name = event["fileName"]
    s3_client = boto3.client("s3", region_name="ap-northeast-1")
    if bucket_name is None:
        raise Exception("bucketName is not set")

    s3_client.download_file(bucket_name, file_name, "/tmp/" + file_name)
    pokemons: list[PokeUrl] = []
    with open("/tmp/pokemons.txt", "r") as file:
        reader = csv.reader(file, delimiter=",", quotechar='"', quoting=csv.QUOTE_MINIMAL)
        for row in reader:
            pokemons.append(PokeUrl(row[0], row[1]))
    os.remove("/tmp/pokemons.txt")
    poke_len = len(pokemons)
    chunk_size = poke_len // 3
    target_pokemons = pokemons[0: chunk_size]
    idx = random.randint(0, chunk_size - 1)
    target_pokemon = target_pokemons[idx]
    poke_res = requests.get(target_pokemon.get_url())
    poke_res_json = poke_res.json()
    poke = Pokemon(poke_res_json["name"], poke_res_json["height"], poke_res_json["weight"])
    return {
        "statusCode": 200,
        "extract_2": {
            "pokemon": poke.get_name(),
            "height": poke.get_height(),
            "weight": poke.get_weight(),
        }
    }
