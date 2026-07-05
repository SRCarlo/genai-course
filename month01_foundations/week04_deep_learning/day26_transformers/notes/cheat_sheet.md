# Day 26 Cheat Sheet - Transformers

## Transformer Pipeline

Text

↓

Tokenizer

↓

Token IDs

↓

Embeddings

↓

Positional Encoding

↓

Encoder

↓

Decoder

↓

Linear Layer

↓

Softmax

↓

Next Token

---

## Core Components

✔ Tokenization

✔ Embeddings

✔ Positional Encoding

✔ Self-Attention

✔ Multi-Head Attention

✔ Feed Forward Network

✔ Residual Connection

✔ Layer Normalization

✔ Encoder

✔ Decoder

---

## Why Transformers?

- Parallel processing
- Faster than RNN/LSTM
- Long-range dependency learning
- GPU efficient
- State-of-the-art NLP

---

## Encoder

Input

↓

Self Attention

↓

Add & Norm

↓

Feed Forward

↓

Add & Norm

---

## Decoder

Previous Tokens

↓

Masked Self Attention

↓

Encoder Attention

↓

Feed Forward

↓

Linear

↓

Softmax

---

## Self-Attention

Every token attends to every other token.

---

## Multi-Head Attention

Multiple attention heads learn different relationships simultaneously.

---

## Feed Forward Network

Linear

↓

ReLU

↓

Linear

---

## Residual Connection

Output = x + Layer(x)

---

## Layer Normalization

Stabilizes training and gradients.

---

## GPT vs BERT vs T5

| GPT | Decoder Only | Text Generation |
|------|--------------|----------------|
| BERT | Encoder Only | Language Understanding |
| T5 | Encoder + Decoder | Seq2Seq Tasks |

---

## Popular Transformer Models

- GPT
- BERT
- T5
- Llama
- Claude
- Gemini
- Mistral

---

## Remember

Embeddings → Meaning

Positional Encoding → Order

Attention → Context

Encoder → Understand

Decoder → Generate

Residual → Preserve Information

LayerNorm → Stable Training

Feed Forward → Learn Features

Transformer = Attention + FFN + Residual + LayerNorm