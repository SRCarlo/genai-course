# Day 27 Cheat Sheet – Build Your First Text Generator (Mini GPT)

## Text Generation

* Predicts the **next token** based on previous tokens.
* Repeats prediction until the desired output length is reached.

**Flow**

```text
Prompt
   ↓
Tokenizer
   ↓
Token IDs
   ↓
Transformer
   ↓
Next Token Prediction
   ↓
Append Token
   ↓
Repeat
```

---

# Character-Level vs Word-Level

| Character-Level                   | Word/Token-Level                  |
| --------------------------------- | --------------------------------- |
| Generates one character at a time | Generates words or subword tokens |
| Small vocabulary                  | Large vocabulary                  |
| Slow                              | Faster                            |
| Simple                            | Used in modern LLMs               |

---

# Vocabulary

Maps tokens to numerical IDs.

```python
vocabulary = {
    "AI": 0,
    "Python": 1,
    "ML": 2
}
```

---

# Token Prediction

```text
I love
   ↓
AI
   ↓
I love AI
   ↓
because
```

Generation = **Predict → Append → Repeat**

---

# Greedy Decoding

* Picks the token with the **highest probability**.
* Fast and deterministic.
* May produce repetitive text.

Example

```text
AI      0.80
Python  0.15
Coffee  0.05

Output → AI
```

---

# Temperature

Controls randomness.

| Temperature | Output      |
| ----------- | ----------- |
| 0.2         | Predictable |
| 0.7         | Balanced    |
| 1.5         | Creative    |

Example

```python
temperature = 0.8
```

---

# Top-k Sampling

* Select only the **Top K** most probable tokens.
* Randomly choose one.

```text
Vocabulary
     ↓
Top 50 Tokens
     ↓
Random Selection
```

---

# Top-p (Nucleus) Sampling

* Select the **smallest set of tokens**
* Cumulative probability ≥ **p**

Example

```text
A = 40%
B = 30%
C = 20%

Total = 90%
```

---

# Hugging Face Pipeline

```python
from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="distilgpt2"
)
```

---

# Generate Text

```python
result = generator(
    "Artificial Intelligence",
    max_length=50,
    temperature=0.8,
    do_sample=True
)

print(result[0]["generated_text"])
```

---

# Save Model

```python
torch.save(
    model.state_dict(),
    "model.pth"
)
```

---

# Load Model

```python
model.load_state_dict(
    torch.load("model.pth")
)

model.eval()
```

---

# Useful Parameters

| Parameter              | Purpose                     |
| ---------------------- | --------------------------- |
| `max_length`           | Maximum output length       |
| `temperature`          | Controls randomness         |
| `do_sample=True`       | Enables sampling            |
| `top_k`                | Sample from Top K tokens    |
| `top_p`                | Nucleus sampling            |
| `num_return_sequences` | Number of generated outputs |

---

# Mini GPT Workflow

```text
Read Dataset
      ↓
Build Vocabulary
      ↓
Load distilgpt2
      ↓
Enter Prompt
      ↓
Generate Text
      ↓
Display Output
      ↓
Save Output
```

---

# Important Concepts

* Text Generation
* Token
* Tokenization
* Vocabulary
* Character-Level Generation
* Word-Level Generation
* Greedy Decoding
* Temperature Sampling
* Top-k Sampling
* Top-p Sampling
* Transformer
* Pretrained Model

---

# Common Commands

Install libraries

```bash
pip install torch transformers tokenizers
```

Run the program

```bash
py mini_text_generator.py
```

---

# Quick Revision

* Text generation predicts one token at a time.
* Vocabulary maps tokens to IDs.
* Tokenization converts text into numbers.
* Greedy decoding always selects the highest-probability token.
* Temperature controls creativity.
* Top-k samples from the top **k** tokens.
* Top-p samples from a probability threshold.
* `distilgpt2` is a lightweight pretrained GPT model.
* Hugging Face `pipeline()` makes text generation simple.
