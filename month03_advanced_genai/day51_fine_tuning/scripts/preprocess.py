import os
import json

MARKDOWN_DIR = "../dataset/markdown"

OUTPUT = "../dataset/train.jsonl"

examples = []

for file in os.listdir(MARKDOWN_DIR):

    if file.endswith(".md"):

        with open(os.path.join(MARKDOWN_DIR, file), encoding="utf-8") as f:

            content = f.read()

        title = content.split("\n")[0].replace("#", "").strip()

        body = "\n".join(content.split("\n")[1:]).strip()

        sample = {
            "messages": [
                {
                    "role": "user",
                    "content": f"What is {title}?"
                },
                {
                    "role": "assistant",
                    "content": body
                }
            ]
        }

        examples.append(sample)

with open(OUTPUT, "w", encoding="utf-8") as f:

    for example in examples:

        f.write(json.dumps(example))

        f.write("\n")

print("Dataset created.")
print("Examples:", len(examples))