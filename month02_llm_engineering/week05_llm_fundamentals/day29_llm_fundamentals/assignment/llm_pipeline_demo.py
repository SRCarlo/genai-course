import time

print("\n_______________ LLM Pipeline Demo ______________\n")

# Step 1: User Prompt
prompt = input("Enter your prompt: ")

time.sleep(1)
print("\nStep 1: User Prompt")
print(prompt)

# Step 2: Tokenization
time.sleep(1)
tokens = prompt.split()

print("\nStep 2: Tokenization")
print("Tokens:", tokens)
print("Total Tokens:", len(tokens))

# Step 3: Embeddings
time.sleep(1)
print("\nStep 3: Embeddings")
print("Converting tokens into numerical vectors... (simulated)")

# Step 4: Transformer
time.sleep(1)
print("\nStep 4: Transformer")
print("Processing tokens using Attention and Feed Forward Network...")

# Step 5: Next Token Prediction
time.sleep(1)
print("\nStep 5: Next Token Prediction")
print("Predicted Next Token: AI")

# Step 6: Response
time.sleep(1)
print("\nStep 6: Generated Response")
print(f"{prompt} AI is transforming the world!")

print("\nLLM Pipeline Completed!")