import json

words = [
    "Artificial",
    "Intelligence",
    "Generative",
    "AI",
    "Python"
]

vocabulary = {
    word: index
    for index, word in enumerate(words)
}

with open("data/vocabulary.json", "w") as f:
    json.dump(vocabulary, f, indent=4)

print(vocabulary)