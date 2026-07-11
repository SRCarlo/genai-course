import json


response = '''
{
    "name":"Python",
    "type":"Programming Language"
}
'''


try:

    data = json.loads(response)


    print(data["name"])
    print(data["type"])


except json.JSONDecodeError:

    print("Invalid JSON")