import torch

# Sentence as a list of words
words = ["I", "love", "learning", "AI"]

print("Original Sentence:")
print(" ".join(words))

# Raw attention scores
scores = {
    "I": 1.0,
    "love": 2.0,
    "learning": 3.0,
    "AI": 4.0
}

print("\nRaw Scores:")
for word, score in scores.items():
    print(word, ":", score)

# Normalize scores using Softmax
score_tensor = torch.tensor(list(scores.values()))
probabilities = torch.softmax(score_tensor, dim=0)

print("\nSoftmax Probabilities:")
for word, prob in zip(scores.keys(), probabilities):
    print(word, ":", round(prob.item(), 4))


# Bonus Function
def visualize_attention(words, scores):
    print("\nAttention Weights")
    for word, score in zip(words, scores):
        print(f"{word} -> {score:.4f}")


visualize_attention(words, probabilities)

# Explanation:
# "AI" gets the highest attention because it is the
# most important word in this example.
# "learning" also gets a high score.
# Common words like "I" receive less attention.