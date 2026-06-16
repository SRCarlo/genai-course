# AI DATA PROCESSING

    # DataSet:
documents = [
    "Python is power",
    "AI is the future",
    "Node.js is scalable"
]

for doc in documents:
    print(doc.upper())
    
# REAL AI EXAMPLE

    # prompt preprocessing:
prompts = [
    "what is ai",
    "what is ml",
    "what is llm"
]

processed = [
    prompt.upper()
    for prompt in prompts
]

print(processed)