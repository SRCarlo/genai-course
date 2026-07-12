# chat_memory.py

messages = []

# Add system message
messages.append({
    "role": "system",
    "content": "You are an AI Mentor."
})

# Add user message
messages.append({
    "role": "user",
    "content": "Hello"
})

# Add assistant response
messages.append({
    "role": "assistant",
    "content": "Hi! How can I help you?"
})

# Print conversation history
print("Conversation History:\n")

for message in messages:
    print(f"{message['role']} : {message['content']}")