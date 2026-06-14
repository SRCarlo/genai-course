# FOR LOOP

# Without loops : 
messages = [
    "Hello",
    "What is AI?",
    "Explain Machine Learning",
    "What is RAG?"
]

print(messages[0])
print(messages[1])
print(messages[2])
print(messages[3])

# Bad.
# What if there are 10,000 messages?

#  Use a loop:
for message in messages:
    print(message)

skills = [
    "Python",
    "Node.js",
    "Next.js",
    "AI"
]

for skill in skills:
    print(skill)