# Mini AI Search Engine

documents = [
    "Python Tutorial",
    "Node.js Guide",
    "AI Engineering"
]

query = "Python"

for doc in documents:

    if "Python" in doc:
        print(
            "Found:",
            doc
        )