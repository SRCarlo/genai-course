# Day 27 - Build Your First Text Generator (Mini GPT)
---

# What is Text Generation?

Text generation is the process of generating new text by repeatedly predicting the next token based on the previous tokens.

### Example

**Input**

```
I love
```

**Prediction**

```
AI
```

The generated sentence becomes:

```
I love AI
```

The model continues predicting the next token until it reaches the desired length.

---

# Text Generation Pipeline

```
User Prompt
      ↓
Tokenizer
      ↓
Token IDs
      ↓
Embeddings
      ↓
Transformer Model
      ↓
Next Token Prediction
      ↓
Append Token
      ↓
Repeat
      ↓
Generated Text
```

---

# Character-Level vs Word-Level Generation

## Character-Level

Predicts one character at a time.

Example:

```
H → e → l → l → o
```

### Advantages

* Small vocabulary
* Easy to understand

### Disadvantages

* Slow
* Needs many prediction steps

---

## Word/Token-Level

Predicts complete words or subword tokens.

Example:

```
Hello → World
```

### Advantages

* Faster
* Better quality
* Used by modern LLMs

### Disadvantages

* Larger vocabulary

---

# Vocabulary

Vocabulary is a mapping between words (or tokens) and numerical IDs.

Example

```python
{
    "Artificial": 0,
    "Intelligence": 1,
    "AI": 2,
    "<PAD>": 3
}
```

---

# Token Prediction

Text generation follows this cycle:

```
Prompt
   ↓
Predict Next Token
   ↓
Append Token
   ↓
Repeat
```

Example

```
I love
↓

AI

↓

I love AI

↓

because

↓

I love AI because

↓

it
```

---

# Greedy Decoding

Greedy decoding always selects the token with the highest probability.

Example

```
AI      0.80
Python  0.15
Coffee  0.05
```

Output:

```
AI
```

### Pros

* Fast
* Deterministic

### Cons

* Can produce repetitive text
* Less creative

---

# Temperature Sampling

Temperature controls randomness.

### Low Temperature (0.2)

* Predictable
* More accurate
* Less creative

### Medium Temperature (0.7)

* Balanced output

### High Temperature (1.5)

* More creative
* More random
* Higher chance of mistakes

---

# Top-k Sampling

Instead of considering every possible token:

```
All Tokens
     ↓
Select Top K Tokens
     ↓
Randomly Pick One
```

Example:

```
Top 50 tokens
↓
Randomly choose one
```

Benefits:

* Better quality
* Less random than sampling from all tokens

---

# Top-p (Nucleus) Sampling

Instead of selecting a fixed number of tokens, choose the smallest group whose cumulative probability reaches a threshold (for example, 90%).

Example

```
Token A → 40%

Token B → 30%

Token C → 20%

Total = 90%
```

Sample only from these tokens.

Benefits:

* Dynamic
* More natural text generation

---

# Hugging Face Transformers

A popular Python library for using pretrained Transformer models.

Example

```python
from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="distilgpt2"
)
```

---

# Why Use distilgpt2?

* Smaller than GPT-2
* Faster
* CPU friendly
* Great for beginners
* No training required

---

# Assignment Summary

* Read text from `sample_text.txt`
* Build a vocabulary
* Save vocabulary as JSON
* Accept user prompts
* Generate text using `distilgpt2`
* Configure `max_length`
* Configure `temperature`
* Save generated text
* Continue until the user enters `exit`

---

# Key Takeaways

* Text generation predicts one token at a time.
* Tokenization converts text into numerical IDs.
* Vocabulary maps tokens to numbers.
* Greedy decoding always picks the highest-probability token.
* Temperature controls randomness.
* Top-k and Top-p improve text diversity.
* Pretrained models like `distilgpt2` make text generation easy.

---

# Interview Questions and Answers

## 1. What is text generation?

Text generation is the process of creating new text by repeatedly predicting the next token based on previously generated tokens.

---

## 2. What is a token?

A token is the basic unit of text processed by a language model. It can be a word, subword, or character.

---

## 3. What is the difference between character-level and word-level generation?

Character-level models generate one character at a time, while word/token-level models generate complete words or subword tokens. Modern LLMs use token-level generation because it is faster and more efficient.

---

## 4. What is a vocabulary?

A vocabulary is a mapping between tokens and unique numerical IDs used by machine learning models.

---

## 5. Why is tokenization important?

Tokenization converts raw text into numerical tokens that neural networks can understand and process.

---

## 6. What is greedy decoding?

Greedy decoding always selects the token with the highest probability at every prediction step.

---

## 7. What is temperature in text generation?

Temperature controls randomness during token selection. Lower values produce more predictable output, while higher values produce more diverse and creative output.

---

## 8. What is Top-k sampling?

Top-k sampling selects the next token from only the top **k** most probable tokens instead of the entire vocabulary.

---

## 9. What is Top-p (Nucleus) sampling?

Top-p sampling selects the next token from the smallest group of tokens whose cumulative probability reaches a chosen threshold, such as 0.9.

---

## 10. Why use pretrained models like distilgpt2?

Pretrained models provide high-quality text generation without requiring expensive training from scratch.

---

## 11. What is the purpose of the Hugging Face `pipeline()` function?

The `pipeline()` function loads a pretrained model and tokenizer, making it easy to perform tasks such as text generation with minimal code.

---

## 12. Which sampling method produces the most deterministic output?

Greedy decoding and low-temperature sampling produce the most deterministic outputs.

---

## 13. Why do modern LLMs use sampling instead of greedy decoding?

Sampling produces more natural, diverse, and less repetitive text than always choosing the highest-probability token.

---

## 14. What does `max_length` control?

`max_length` specifies the maximum number of tokens the model can generate, including the input prompt.

---

## 15. What does `do_sample=True` do?

It enables random sampling during generation. If set to `False`, the model uses deterministic decoding such as greedy search.

---

# Revision Summary

* Text generation predicts one token at a time.
* Vocabulary maps tokens to IDs.
* Tokenization converts text into numbers.
* Greedy decoding always picks the highest-probability token.
* Temperature controls randomness.
* Top-k selects from the top **k** tokens.
* Top-p selects from the smallest high-probability token set.
* `distilgpt2` is a lightweight pretrained Transformer suitable for learning text generation.
