from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="distilgpt2"
)

prompt = input("Enter Prompt: ")

output = generator(
    prompt,
    max_length=80,
    temperature=0.8,
    do_sample=True
)

print("\nGenerated Text:\n")
print(output[0]["generated_text"])