predictions = {
    "AI": 0.80,
    "Python": 0.15,
    "Coffee": 0.05
}

greedy = max(
    predictions,
    key=predictions.get
)

print("Greedy:", greedy)