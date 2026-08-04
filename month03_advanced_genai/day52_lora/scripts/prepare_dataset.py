import json
from datasets import Dataset


INPUT_FILE = "../dataset/train.jsonl"
OUTPUT_FILE = "../dataset/processed_train.json"


data = []


with open(INPUT_FILE, "r", encoding="utf-8") as file:

    for line in file:
        item = json.loads(line)

        text = ""

        for message in item["messages"]:
            text += (
                message["role"]
                + ": "
                + message["content"]
                + "\n"
            )

        data.append(
            {
                "text": text
            }
        )


dataset = Dataset.from_list(data)


dataset.to_json(
    OUTPUT_FILE
)


print("Dataset prepared")
print(dataset)