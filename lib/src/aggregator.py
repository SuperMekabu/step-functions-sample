def handler(event, context):
    extract_1 = event["extract_1"]
    extract_2 = event["extract_2"]
    extract_3 = event["extract_3"]

    max_height = max(extract_1["height"], extract_2["height"], extract_3["height"])
    max_weight = max(extract_1["weight"], extract_2["weight"], extract_3["weight"])
    taller_name = extract_1["name"] \
        if extract_2["height"] == max_height else extract_2["name"] \
        if extract_3["height"] == max_height else extract_3["name"]
    heavier_name = extract_1["name"] \
        if extract_2["weight"] == max_weight else extract_2["name"] \
        if extract_3["weight"] == max_weight else extract_3["name"]

    return {
        "statusCode": 200,
        "taller": taller_name,
        "heavier": heavier_name
    }
