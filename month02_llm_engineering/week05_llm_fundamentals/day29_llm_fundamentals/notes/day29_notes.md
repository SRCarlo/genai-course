# Day 29 - LLM Fundamentals (Large Language Models)

## Objective

Learn what Large Language Models (LLMs) are, how they work internally, and how they are used in real-world AI applications.

---

# What is an LLM?

LLM stands for **Large Language Model**.

A Large Language Model is a deep learning model based on the **Transformer architecture** that is trained on massive amounts of text to understand, generate, summarize, translate, and answer questions in natural language.

Examples:

- GPT-5
- GPT-4.1
- Claude
- Gemini
- Llama
- Mistral
- DeepSeek
- Gemma

---

# Why is it called "Large"?

Because it contains:

- Billions of parameters
- Massive training datasets
- Huge vocabularies
- Large context windows
- Deep Transformer networks

Example:

| Model | Approximate Parameters |
|--------|-----------------------|
| GPT-2 | 1.5 Billion |
| Llama 2 7B | 7 Billion |
| Llama 3 70B | 70 Billion |

---

# Evolution of AI

Rule-Based AI

↓

Machine Learning

↓

Deep Learning

↓

Neural Networks

↓

Transformers

↓

Large Language Models

↓

AI Applications

---

# LLM Working Pipeline

User Prompt

↓

Tokenizer

↓

Token IDs

↓

Embeddings

↓

Transformer Layers

↓

Attention

↓

Feed Forward Network

↓

Probability Distribution

↓

Next Token Prediction

↓

Generated Response

---

# Step 1 - Prompt

Example:

Explain Artificial Intelligence

---

# Step 2 - Tokenization

The prompt is divided into smaller pieces called tokens.

Example:

ChatGPT is amazing!

Possible Tokens:

Chat

G

PT

is

amazing

!

Different models use different tokenizers.

---

# What is a Token?

A token is the smallest unit of text processed by an LLM.

A token can be:

- A word
- Part of a word
- A punctuation symbol
- A special character

Example:

Sentence:

Machine Learning is powerful.

Tokens:

Machine

Learning

is

powerful

.

---

# Embeddings

Tokens are converted into numerical vectors.

Example:

AI

↓

[0.42, -0.91, 0.18, ...]

These vectors help the model understand semantic meaning.

Words with similar meanings have similar embeddings.

---

# Transformer Architecture

The Transformer processes text using self-attention.

Pipeline:

Embedding

↓

Positional Encoding

↓

Multi-Head Attention

↓

Feed Forward Network

↓

Layer Normalization

↓

Prediction

---

# Next Token Prediction

LLMs generate text one token at a time.

Example:

Prompt:

I love

Prediction:

AI

Now prompt becomes:

I love AI

Next prediction:

because

This process repeats until the response is complete.

---

# Parameters

Parameters are the learned weights inside the neural network.

More parameters generally improve:

- Language understanding
- Reasoning
- Generalization

But require:

- More memory
- More computation
- Higher cost

---

# Context Window

The context window is the maximum amount of text the model can consider in a single request.

A larger context window allows the model to remember more conversation history.

---

# Pretraining

Pretraining is the initial training of a model on massive text datasets.

Purpose:

- Learn grammar
- Learn facts
- Learn language patterns
- Learn reasoning abilities

Very expensive.

Usually performed by AI companies.

---

# Fine-Tuning

Fine-tuning means continuing training on a smaller task-specific dataset.

Examples:

- Medical chatbot
- Legal assistant
- Customer support bot
- Banking assistant

Benefits:

- Faster
- Cheaper
- Domain-specific

---

# Open Source Models

Examples:

- Llama
- Mistral
- Gemma
- DeepSeek

Advantages:

- Free to run
- Highly customizable
- Full control

Disadvantages:

- Need GPUs
- Deployment complexity
- Maintenance responsibility

---

# Hosted Models

Examples:

- OpenAI
- Anthropic
- Google AI

Advantages:

- Easy API integration
- No GPU management
- Latest models

Disadvantages:

- API cost
- Internet dependency
- Rate limits

---

# Hosted vs Local

| Hosted Models | Local Models |
|---------------|-------------|
| Easy setup | Full control |
| Managed by provider | Self-managed |
| API based | Hardware required |
| Usage cost | No API cost after setup |

---

# Node.js Architecture

User

↓

Next.js Frontend

↓

Express.js Backend

↓

LLM API

↓

JSON Response

↓

Frontend

↓

User

---

# Important Terms

- LLM
- Token
- Tokenization
- Embedding
- Transformer
- Attention
- Parameters
- Context Window
- Pretraining
- Fine-Tuning
- Hosted Models
- Local Models

---

# Summary

An LLM converts text into tokens, transforms them into embeddings, processes them through Transformer layers, predicts the next token repeatedly, and generates human-like responses.

---

# Interview Questions and Answers

## 1. What is an LLM?

An LLM (Large Language Model) is a Transformer-based neural network trained on massive text datasets to understand and generate human language.

---

## 2. Why are LLMs called Large?

Because they contain billions of learned parameters and are trained on huge datasets.

---

## 3. What is a token?

A token is the basic unit of text processed by an LLM. It may be a word, part of a word, or punctuation.

---

## 4. What is tokenization?

Tokenization is the process of converting text into tokens before processing.

---

## 5. What is an embedding?

An embedding is a dense numerical vector representing the meaning of a token.

---

## 6. What is the Transformer architecture?

A neural network architecture that uses self-attention to process relationships between tokens.

---

## 7. What is self-attention?

Self-attention helps the model determine which words in a sentence are most relevant to one another.

---

## 8. What is next-token prediction?

The process of predicting one token at a time until the response is complete.

---

## 9. What are parameters?

Parameters are learned numerical weights that store the model's knowledge.

---

## 10. What is a context window?

The maximum number of tokens the model can consider in one request.

---

## 11. What is pretraining?

Training a model on a very large general-purpose dataset to learn language patterns.

---

## 12. What is fine-tuning?

Additional training on a smaller dataset for a specific task or domain.

---

## 13. Difference between pretraining and fine-tuning?

Pretraining teaches general knowledge, while fine-tuning specializes the model for a specific task.

---

## 14. Name some open-source LLMs.

- Llama
- Gemma
- Mistral
- DeepSeek

---

## 15. Hosted vs Local models?

Hosted models are accessed through APIs and managed by providers.

Local models run on your own hardware and provide more control.

---
