import json

FILE_PATH = "../dataset/train.jsonl"

stats = {
    "examples": 0,
    "user_messages": 0,
    "assistant_messages": 0
}

with open(FILE_PATH, "r", encoding="utf-8") as file:
    for line in file:
        data = json.loads(line)

        stats["examples"] += 1

        for message in data["messages"]:
            if message["role"] == "user":
                stats["user_messages"] += 1

            elif message["role"] == "assistant":
                stats["assistant_messages"] += 1

with open("../dataset/stats.json", "w", encoding="utf-8") as file:
    json.dump(stats, file, indent=4)

print("Statistics saved to dataset/stats.json")
print(stats)