# DAY 39 — LangChain (Building AI Applications Faster)

---

# Introduction

LangChain is one of the most important frameworks in Generative AI Engineering.

Before LangChain, we learned:

- Embeddings
- Vector Databases
- RAG
- Chunking
- Retrieval

LangChain connects all these components together to build complete AI applications.

Applications built using LangChain:

- AI Chatbots
- RAG Applications
- AI Agents
- AI Search Systems
- AI Assistants
- Multi-Agent Systems
- Enterprise AI Platforms

---

# 1. What is LangChain?

LangChain is an open-source framework for building applications powered by Large Language Models (LLMs).

It provides reusable components to connect:

- LLMs
- Prompts
- Memory
- Tools
- Agents
- Retrievers
- Vector Databases
- Output Parsers

Think of LangChain as:

```
Express.js for AI Applications
```

---

# 2. Why LangChain Exists?

Without LangChain:

```
User

↓

Prompt

↓

LLM

↓

Response
```

Problems:

- Hard to manage prompts
- No built-in memory
- Difficult tool integration
- Difficult RAG implementation
- Repeated code

With LangChain:

```
User

↓

Prompt Template

↓

Retriever

↓

Memory

↓

Tools

↓

LLM

↓

Output Parser

↓

Response
```

LangChain provides reusable building blocks.

---

# 3. LangChain Architecture

```
User

↓

Application

↓

Prompt Template

↓

Retriever

↓

Memory

↓

Tools

↓

LLM

↓

Output Parser

↓

Final Response
```

---

# 4. Core Components of LangChain

## 1. Models

Models connect applications with LLM providers.

Examples:

- Groq
- OpenAI
- Anthropic
- Google Gemini


Example:

```javascript
const model = new ChatGroq({

model:"llama-3.3-70b-versatile"

});
```

---

# 2. Prompt Templates

Prompt Templates create reusable prompts.

Instead of:

```
Explain Node.js
```

Use:

```
Explain {topic}
```

Example:

```javascript
PromptTemplate.fromTemplate(
"Explain {topic}"
)
```

Input:

```javascript
{
topic:"LangChain"
}
```

Output:

```
Explain LangChain
```

Benefits:

- Reusable prompts
- Dynamic input
- Cleaner code
- Easy maintenance

---

# 3. Chains

A Chain combines multiple components.

Example:

```
Prompt

↓

LLM

↓

Output Parser

↓

Response
```

Example:

```javascript
const chain =
prompt
.pipe(model)
.pipe(parser);
```

---

# 4. LangChain Expression Language (LCEL)

LCEL stands for LangChain Expression Language.

It is used to compose AI workflows.

Example:

```javascript
prompt
.pipe(model)
.pipe(parser)
```

Flow:

```
Input

↓

Prompt Template

↓

LLM

↓

Parser

↓

Output
```

Benefits:

- Simple syntax
- Reusable workflows
- Streaming support
- Async execution
- Easy debugging

---

# 5. Output Parsers

Output Parsers convert LLM output into structured formats.

## String Output Parser

Returns plain text.

Example:

```
LangChain is an AI framework.
```

---

## JSON Output Parser

Returns JSON format.

Example:

```json
{
"name":"John",
"age":25,
"skills":["AI","Node.js"]
}
```

---

## Structured Output Parser

Used when applications require fixed formats.

Example:

Resume Analyzer:

```json
{
"name":"",
"skills":[],
"experience":""
}
```

---

# 6. Memory

Memory stores conversation history.

Example:

User:

```
My name is Rahul
```

Memory stores:

```
User: My name is Rahul
```

Later:

User:

```
What is my name?
```

AI:

```
Your name is Rahul.
```

## Types of Memory

## Buffer Memory

Stores complete conversation.

---

## Summary Memory

Stores summarized conversation.

---

## Window Memory

Stores recent messages only.

---

# 7. Tools

Tools allow AI models to interact with external systems.

Examples:

- Calculator
- Database
- Weather API
- Search API
- GitHub API


Flow:

```
User Question

↓

Agent

↓

Tool Selection

↓

Tool Execution

↓

Result

↓

Final Answer
```

---

# 8. Agents

Agents are systems that decide what action should be performed.

Example:

Question:

```
What is 200 × 50?
```

Agent thinks:

```
Need calculator tool
```

Flow:

```
Question

↓

Agent

↓

Select Tool

↓

Execute Tool

↓

Answer
```

---

# 9. RAG (Retrieval Augmented Generation)

RAG allows LLMs to use external knowledge.

Normal LLM:

```
Question

↓

LLM

↓

Answer
```

RAG:

```
Question

↓

Retriever

↓

Relevant Documents

↓

LLM

↓

Answer
```

RAG Components:

1. Document Loader
2. Text Splitter
3. Embeddings
4. Vector Database
5. Retriever
6. LLM

---

# 10. Embeddings

Embeddings convert text into numerical vectors.

Example:

```
"Dog"

↓

[0.23,0.45,0.89]
```

Similar meanings create similar vectors.

Used for:

- Semantic Search
- RAG
- Recommendations

---

# 11. Vector Database

Vector databases store embeddings.

Examples:

- Qdrant
- Pinecone
- Chroma
- Weaviate

Purpose:

Find similar information based on meaning.

---

# 12. Production AI Architecture

```
Next.js

↓

Express API

↓

LangChain

↓

Retriever

↓

Vector Database

↓

Memory

↓

Tools

↓

Groq/OpenAI

↓

Response
```

Production Stack:

Frontend:
- Next.js

Backend:
- Express.js

AI Framework:
- LangChain

Vector Database:
- Qdrant

Memory:
- Redis

LLM:
- Groq

Monitoring:
- LangSmith

---

# Interview Questions and Answers

---

# Q1. What is LangChain?

Answer:

LangChain is an open-source framework used to build LLM-powered applications.

It provides reusable components:

- Prompt Templates
- Chains
- Agents
- Tools
- Memory
- Retrievers
- Output Parsers

It simplifies AI application development.

---

# Q2. Why do we use LangChain?

Answer:

LangChain reduces the complexity of building AI applications.

It provides:

- Prompt management
- Memory handling
- Tool integration
- RAG support
- Agent workflows

---

# Q3. What is LCEL?

Answer:

LCEL stands for LangChain Expression Language.

It allows developers to connect LangChain components using pipelines.

Example:

```javascript
prompt
.pipe(model)
.pipe(parser)
```

---

# Q4. What is a Chain?

Answer:

A Chain is a sequence of connected LangChain components.

Example:

```
Prompt

↓

LLM

↓

Parser

↓

Response
```

---

# Q5. What is Memory in LangChain?

Answer:

Memory stores previous conversations so AI applications can remember context.

Example:

Chatbots use memory to maintain conversation history.

---

# Q6. What are Tools in LangChain?

Answer:

Tools are external functions that an LLM can call.

Examples:

- Calculator
- Database
- Search API
- Weather API

---

# Q7. What is an Agent?

Answer:

An Agent is an AI system that decides which tools or actions are required to complete a task.

---

# Q8. What is RAG?

Answer:

RAG means Retrieval Augmented Generation.

It improves LLM responses by retrieving external information before generating answers.

Advantages:

- Uses private data
- Reduces hallucination
- Improves accuracy

---

# Q9. What is a Retriever?

Answer:

A Retriever searches and returns relevant documents from a knowledge source.

Example:

```
Question

↓

Retriever

↓

Relevant Documents

↓

LLM
```

---

# Q10. What is a Vector Database?

Answer:

A Vector Database stores embeddings and performs similarity searches.

Examples:

- Qdrant
- Pinecone
- Chroma

---

# Q11. Difference Between Chain and Agent?

## Chain

- Fixed workflow
- Developer defines steps

Example:

```
Prompt → LLM → Parser
```


## Agent

- Dynamic workflow
- AI decides steps

Example:

```
Question → Tool Decision → Action → Answer
```

---

# Q12. What is LangSmith?

Answer:

LangSmith is a monitoring and debugging platform for LangChain applications.

Used for:

- Tracking requests
- Debugging chains
- Evaluating outputs
- Monitoring production AI systems

---

# Best Practices

- Use Prompt Templates

- Prefer LCEL

- Build reusable chains

- Keep prompts separate from business logic

- Add memory carefully

- Use vector databases for private knowledge

- Monitor applications with LangSmith

- Never hardcode API keys

---

# Common Mistakes

- Writing huge prompts everywhere

- No prompt templates

- Ignoring LCEL

- No memory management

- Mixing business logic with prompts

- Hardcoding API keys

---

LangChain helps developers build complete AI applications faster using reusable components.