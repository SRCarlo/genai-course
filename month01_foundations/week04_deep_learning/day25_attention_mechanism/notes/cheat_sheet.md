# Day 25 Cheat Sheet: Attention Mechanism

## Definition

The Attention Mechanism allows a model to focus on the most relevant words in a sequence instead of treating every word equally. It is the foundation of Transformer models.

---

# Why Attention?

- Solves the long-term dependency problem
- Improves context understanding
- Handles long sequences effectively
- Enables parallel processing
- Forms the foundation of Transformers and GPT models

---

# RNN vs Attention

| RNN | Attention |
|------|-----------|
| Processes one word at a time | Looks at all words simultaneously |
| Struggles with long sequences | Handles long dependencies well |
| Sequential processing | Parallel processing |
| Slower training | Faster training |
| Limited context | Better context understanding |

---

# Encoder-Decoder Architecture

```
Input Sentence
      ↓
   Encoder
      ↓
Context
      ↓
   Decoder
      ↓
Output Sentence
```

With Attention:

```
Decoder
    ↓
Looks at all Encoder Outputs
    ↓
Finds Important Words
    ↓
Generates Output
```

---

# Query (Q), Key (K), Value (V)

| Component | Meaning |
|-----------|---------|
| Query (Q) | What the current word is looking for |
| Key (K) | Information available for comparison |
| Value (V) | Information returned after attention |

---

# Attention Process

```
Sentence
    ↓
Embeddings
    ↓
Generate Q, K, V
    ↓
Calculate Attention Scores
    ↓
Apply Softmax
    ↓
Weighted Sum
    ↓
Output
```

---

# Attention Score

Measures how important one word is to another.

Example:

| Word | Score |
|------|------:|
| AI | 0.60 |
| Learning | 0.25 |
| Love | 0.10 |
| I | 0.05 |

Higher score = More attention

---

# Softmax

Converts raw scores into probabilities.

Example:

Raw Scores

```
2.1
4.0
1.5
```

Softmax Output

```
0.10
0.75
0.15
```

Properties:

- Values between 0 and 1
- Total equals 1

---

# Scaled Dot Product Attention

Formula:

```
Attention(Q, K, V)

= Softmax((Q × Kᵀ) / √d) × V
```

Steps:

1. Compute Q × Kᵀ
2. Scale by √d
3. Apply Softmax
4. Multiply by V

---

# Self-Attention

Each word attends to every other word in the same sentence.

Example:

```
I love AI because it is powerful.
```

"It" attends to "AI".

---

# Multi-Head Attention

Multiple attention heads learn different relationships.

Example:

- Head 1 → Grammar
- Head 2 → Meaning
- Head 3 → Context

Outputs are combined for a richer representation.

---

# Advantages of Attention

- Better context understanding
- Captures long-range relationships
- Faster training
- Parallel computation
- Highly scalable
- Improves translation and text generation

---

# GPT Pipeline

```
Input Text
      ↓
Tokenization
      ↓
Embeddings
      ↓
Self-Attention
      ↓
Multi-Head Attention
      ↓
Feed Forward Network
      ↓
Next Token Prediction
```

---

# Key Formulas

### Softmax

```
Softmax(xᵢ) = eˣⁱ / Σeˣ
```

### Attention

```
Attention(Q, K, V)

= Softmax((Q × Kᵀ) / √d) × V
```

---

# Common Interview Points

- Attention solves long-term dependency problems.
- Q = Query, K = Key, V = Value.
- Self-Attention compares words within the same sequence.
- Multi-Head Attention learns multiple relationships simultaneously.
- Transformers outperform RNNs because they process tokens in parallel.
- GPT models are built using Transformer architecture.

---

# Quick Revision

- Attention focuses on important words.
- Q = What to search.
- K = Available information.
- V = Returned information.
- Softmax converts scores to probabilities.
- Self-Attention works within the same sentence.
- Multi-Head Attention uses multiple attention mechanisms.
- Transformers use Attention instead of RNNs.
- GPT is based on Transformer architecture.