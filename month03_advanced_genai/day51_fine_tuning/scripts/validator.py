import json

FILE = "../dataset/train.jsonl"

count = 0

with open(FILE, encoding="utf-8") as f:

    for line in f:

        json.loads(line)

        count += 1

print("JSONL Valid")
print("Samples:", count)