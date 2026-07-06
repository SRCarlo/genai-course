import os
import json
from transformers import pipeline

# Get project path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# File paths
data_file = os.path.join(BASE_DIR, "..", "data", "sample_text.txt")
vocab_file = os.path.join(BASE_DIR, "..", "data", "vocabulary.json")
output_file = os.path.join(BASE_DIR, "..", "generated_text.txt")

# Read dataset
with open(data_file, "r", encoding="utf-8") as file:
    text = file.read()

print("Dataset Loaded!\n")

# Build vocabulary
words = text.split()

vocabulary = {}

for word in words:
    if word not in vocabulary:
        vocabulary[word] = len(vocabulary)

# Save vocabulary
with open(vocab_file, "w", encoding="utf-8") as file:
    json.dump(vocabulary, file, indent=4)

print("Vocabulary Created!")

# Load pretrained model
print("Loading model...")
generator = pipeline(
    "text-generation",
    model="distilgpt2"
)
print("Model Loaded!\n")

# Generate text
while True:
    prompt = input("Enter Prompt (type 'exit' to quit): ")

    if prompt.lower() == "exit":
        print("Goodbye!")
        break

    max_length = int(input("Enter max_length: "))
    temperature = float(input("Enter temperature: "))

    result = generator(
        prompt,
        max_length=max_length,
        temperature=temperature,
        do_sample=True
    )

    generated_text = result[0]["generated_text"]

    print("\nGenerated Text:\n")
    print(generated_text)

    # Save output
    with open(output_file, "a", encoding="utf-8") as file:
        file.write(f"Prompt: {prompt}\n")
        file.write(generated_text + "\n")
        file.write("-" * 50 + "\n")

    print("\nOutput saved to generated_text.txt\n")