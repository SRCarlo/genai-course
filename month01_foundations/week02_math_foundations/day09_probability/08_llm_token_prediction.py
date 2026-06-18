# Mini LLM Simulation

next_word = {
    "I love": {
        "Pyhton": 0.7,
        "Java": 0.2,
        "C++": 0.1
    }
}

sentence = "I love"

prediction = max(
    next_word[sentence],
    key=next_word[sentence].get
)

print(
    "Predicted Word:",
    prediction
)