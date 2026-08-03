# Day 51 – Fine-Tuning Fundamentals

## What is Fine-Tuning?

Fine-tuning is the process of training a pre-trained Large Language Model (LLM) on a task-specific dataset so it performs better for a particular domain or use case.

---

## Why Fine-Tuning?

- Specialize a model for a domain (medical, legal, finance, coding).
- Improve response style and consistency.
- Teach custom behaviors.

---

## Types of Fine-Tuning

### 1. Full Fine-Tuning

- Updates all model parameters.
- Requires high GPU memory.
- Expensive.

### 2. PEFT (Parameter-Efficient Fine-Tuning)

- Updates only a small number of parameters.
- Faster and cheaper.

### 3. LoRA (Low-Rank Adaptation)

- Most popular PEFT method.
- Low GPU requirements.
- Industry standard.

---

## Supervised Fine-Tuning (SFT)

The model learns from instruction-response pairs.

Example:

Instruction:
What is Node.js?

Response:
Node.js is a JavaScript runtime environment.

---

## Instruction Tuning

Instruction tuning teaches the model to follow user instructions rather than simply predict the next word.

---

## JSONL Format

Each line is a separate JSON object.

Example:

{
"messages": [
{
"role": "user",
"content": "What is Express.js?"
},
{
"role": "assistant",
"content": "Express.js is a Node.js framework."
}
]
}

---

## Fine-Tuning Workflow

1. Collect data
2. Clean data
3. Convert to JSONL
4. Train
5. Evaluate
6. Deploy
7. Monitor

---

## Fine-Tuning vs RAG

Fine-Tuning

- Changes model behavior
- Best for stable knowledge
- Requires retraining

RAG

- Retrieves external documents
- Best for frequently changing information
- No retraining required

---

## Libraries

- transformers
- datasets
- peft
- trl
- accelerate

---

