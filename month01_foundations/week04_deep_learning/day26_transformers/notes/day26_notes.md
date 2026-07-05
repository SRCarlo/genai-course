# Day 26 - Transformers

## Overview

Transformers are the deep learning architecture behind modern Large Language Models such as:

- ChatGPT
- Gemini
- Claude
- Llama
- Mistral

The Transformer architecture was introduced in the paper:

**Attention Is All You Need (2017)**

Unlike RNNs and LSTMs, Transformers process all tokens in parallel using Self-Attention.

---

# Evolution of NLP

Rule-Based Systems

↓

Machine Learning

↓

RNN

↓

LSTM

↓

Attention

↓

Transformer

↓

GPT • BERT • T5 • Llama • Claude • Gemini

---

# Why Transformers Replaced RNNs

## Problems with RNNs

- Sequential processing
- Slow training
- Poor long-term memory
- Difficult GPU parallelization

## Transformer Advantages

- Parallel processing
- Faster training
- Better long-range dependency learning
- Highly scalable
- State-of-the-art NLP performance

---

# Transformer Pipeline

Input Text

↓

Tokenization

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

Next Token Prediction

---

# Transformer Components

## 1. Tokenization

Splits text into tokens.

Example

"I love AI"

↓

["I", "love", "AI"]

---

## 2. Embeddings

Converts token IDs into dense vectors.

Example

Token ID

↓

Embedding Vector

↓

[0.12, -0.45, 0.82, ...]

Purpose:

- Semantic representation
- Numerical input for neural networks

---

## 3. Positional Encoding

Transformers process tokens simultaneously.

They do not know word order naturally.

Positional Encoding adds sequence information.

Example

Dog bites man

≠

Man bites dog

---

## 4. Encoder

The encoder reads the input sequence and produces contextual representations.

Encoder Block

Embedding

↓

Self Attention

↓

Add & Normalize

↓

Feed Forward Network

↓

Add & Normalize

---

## 5. Decoder

The decoder generates one token at a time.

Decoder Block

Masked Self Attention

↓

Encoder-Decoder Attention

↓

Feed Forward

↓

Linear

↓

Softmax

---

## 6. Self Attention

Allows every word to attend to every other word.

Example

"The animal didn't cross the road because **it** was tired."

Attention helps identify that **it** refers to **animal**.

---

## 7. Multi-Head Attention

Instead of one attention mechanism, several attention heads work in parallel.

Example

Head 1 → Grammar

Head 2 → Context

Head 3 → Subject

Head 4 → Meaning

Outputs are concatenated.

Benefits

- Better context understanding
- Learns multiple relationships simultaneously

---

## 8. Feed Forward Network

Each token independently passes through a neural network.

Architecture

Linear

↓

ReLU

↓

Linear

Purpose

- Feature extraction
- Non-linear transformation

---

## 9. Residual Connection

Instead of replacing information,

Output = x + Layer(x)

Benefits

- Preserves information
- Easier optimization
- Better gradient flow

---

## 10. Layer Normalization

Normalizes activations after each sub-layer.

Benefits

- Stable gradients
- Faster convergence
- Better training

---

# GPT vs BERT vs T5

| Model | Architecture | Purpose |
|--------|-------------|----------|
| GPT | Decoder Only | Text Generation |
| BERT | Encoder Only | Text Understanding |
| T5 | Encoder + Decoder | Translation, Summarization, QA |

---

# GPT

Uses only the Decoder.

Suitable for:

- Chatbots
- Code Generation
- Story Writing
- Text Completion

---

# BERT

Uses only the Encoder.

Suitable for:

- Text Classification
- Sentiment Analysis
- Named Entity Recognition
- Search

---

# T5

Uses Encoder + Decoder.

Suitable for

- Translation
- Question Answering
- Summarization

---

# Why Modern LLMs Use Transformers

Transformers provide

- Better scalability
- Parallel processing
- Efficient GPU utilization
- Long-context understanding
- High-quality text generation

Examples

- GPT
- Claude
- Gemini
- Llama
- Mistral

---

# Interview Questions & Answers

## 1. What is a Transformer?

A Transformer is a deep learning architecture based on self-attention that processes sequence data in parallel.

---

## 2. Why did Transformers replace RNNs?

Because they:

- Process tokens in parallel
- Learn long-range dependencies
- Train faster
- Scale efficiently

---

## 3. What is Self-Attention?

Self-attention allows every token to focus on other relevant tokens in the same sequence.

---

## 4. What is an Embedding?

A dense numerical representation of a token capturing semantic meaning.

---

## 5. Why is Positional Encoding required?

Because Transformers process all tokens simultaneously and need explicit position information.

---

## 6. What is the Encoder?

The encoder reads the input sequence and generates contextual embeddings.

---

## 7. What is the Decoder?

The decoder generates output tokens one at a time using previous outputs.

---

## 8. What is Multi-Head Attention?

Multiple attention mechanisms running in parallel, each learning different relationships.

---

## 9. What is a Feed Forward Network?

A fully connected neural network applied independently to every token after attention.

---

## 10. Why are Residual Connections important?

They preserve information and improve gradient flow.

---

## 11. What is Layer Normalization?

A normalization method that stabilizes activations and speeds up training.

---

## 12. Difference between GPT and BERT?

GPT

- Decoder Only
- Text Generation

BERT

- Encoder Only
- Language Understanding

---

## 13. What paper introduced Transformers?

Attention Is All You Need (2017)

---

## 14. Why do LLMs use Transformers?

Because they are efficient, scalable, parallelizable, and capture long-range dependencies effectively.

---

# Key Takeaways

- Transformers replaced RNNs and LSTMs.
- Self-Attention is the core innovation.
- Embeddings convert tokens into vectors.
- Positional Encoding provides sequence order.
- Encoder understands input.
- Decoder generates output.
- Multi-Head Attention captures multiple relationships.
- Residual Connections and Layer Normalization stabilize training.
- GPT, BERT, and T5 are Transformer-based architectures.
- Transformers power nearly all modern Large Language Models.