# Lists


# Exmaples
tokens = ["hello", "world"]

messages = [
    "What is AI?",
    "Explain Machine Learning"
]

embeddings = [0.22, 0.67, 0.91]

print(tokens)
print(messages)
print(embeddings)

# Create List
skills = ["Python", "Node.js", "Next.js", "AI"]
print(skills)

# Access Items
tech = ["Python", "AI", "ML", "Gen AI"]
print(tech[0])

# Negative Index
print(tech[-1]) # last index

# Add Item 
langauges = ["Python", "Gen AI", "Java"]
langauges.append("Artificial Intelligence") # Add Item in last
print(langauges)

# Remove Item
langauges.remove("Java")
print(langauges)

# Length
print(len(langauges))