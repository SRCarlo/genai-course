from datasets import load_dataset

print("Loading dataset...")

dataset = load_dataset(
    "json",
    data_files="../dataset/train.jsonl"
)

print(dataset)

print("\nFirst training example:")
print(dataset["train"][0])

print("\n Dataset loaded successfully.")