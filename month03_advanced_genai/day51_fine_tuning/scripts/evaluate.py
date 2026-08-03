import json

FILE_PATH = "../dataset/train.jsonl"

examples = 0
total_words = 0

with open(FILE_PATH, "r", encoding="utf-8") as file:
    for line in file:
        data = json.loads(line)

        assistant_text = data["messages"][1]["content"]

        total_words += len(assistant_text.split())

        examples += 1

average = total_words / examples if examples else 0

print("Dataset Evaluation")
print("------------------")
print(f"Examples        : {examples}")
print(f"Total Words     : {total_words}")
print(f"Average Words   : {average:.2f}")