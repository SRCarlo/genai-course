# Day 33 - Context Window & Conversation Memory

---

# SECTION 1 - What is a Context Window?

The context window is the maximum amount of information (measured in tokens) that an LLM can process in one request.

An LLM does not remember conversations permanently.

The application sends previous messages again with every API request.

Example:

User:

```
My name is Shubham.
```

AI:

```
Nice to meet you, Shubham.
```

Later:

User:

```
What is my name?
```

The AI can answer because the previous messages were included again.

---

# SECTION 2 - How Chat Applications Work

Flow:

```
User

↓

Express Server

↓

Conversation History

↓

Groq API

↓

LLM

↓

Response

↓

Save Response

↓

User
```

The LLM itself does not store memory.

The application manages memory.

---

# SECTION 3 - Messages Array

LLM APIs use a messages array.

Example:

```javascript
const messages = [
    {
        role: "system",
        content: "You are an AI mentor."
    },
    {
        role: "user",
        content: "My name is Shubham."
    },
    {
        role: "assistant",
        content: "Nice to meet you, Shubham."
    },
    {
        role: "user",
        content: "What is my name?"
    }
];
```

Every request sends the required conversation history to the LLM.

---

# SECTION 4 - Message Roles

## 1. System Role

Defines AI behaviour.

Example:

```
You are a Senior AI Engineer.
```

---

## 2. User Role

Contains user input.

Example:

```
Explain Node.js.
```

---

## 3. Assistant Role

Contains previous AI responses.

Example:

```
Node.js is a JavaScript runtime.
```

---

# SECTION 5 - Node.js Chat Memory

Example:

```javascript
const messages = [];

function addMessage(role, content){

    messages.push({
        role,
        content
    });

}

addMessage(
    "system",
    "You are an AI Mentor."
);

addMessage(
    "user",
    "My name is Shubham."
);

console.log(messages);
```

The messages array stores conversation history.

---

# SECTION 6 - Groq Chat Memory

Steps:

1. Add user message.
2. Send messages array to Groq API.
3. Receive AI response.
4. Store assistant response.
5. Continue conversation.

Example:

```javascript
messages.push({
    role:"user",
    content:userMessage
});


const response = await groq.chat.completions.create({

    model:"llama-3.3-70b-versatile",

    messages

});


messages.push({

    role:"assistant",

    content:reply

});
```

---

# SECTION 7 - Why Context Cannot Grow Forever

Sending the complete conversation every time creates problems:

- Higher API cost
- Higher latency
- More token usage
- Context window overflow

Example:

```
Message 1

Message 2

...

Message 500
```

---

# SECTION 8 - Sliding Window Technique

Sliding window keeps only recent messages.

Example:

```javascript
if(messages.length > 20){

    messages.splice(1,2);

}
```

Keeps:

- System prompt
- Recent user messages
- Recent assistant messages

---

# SECTION 9 - Conversation Summarization

Instead of storing thousands of messages:

```
Conversation

↓

Summary

↓

Store Summary

↓

Continue Chat
```

Example:

```
User is learning Node.js and Generative AI.
```

---

# SECTION 10 - Short-Term vs Long-Term Memory

## Short-Term Memory

Current conversation history sent to the LLM.

Example:

```
messages array
```

---

## Long-Term Memory

Information stored outside the model.

Examples:

- MongoDB
- PostgreSQL
- Redis

Used for:

- User preferences
- Previous conversations
- User information

---

# SECTION 11 - Best Practices

## Always use system prompt

Define AI behaviour.

## Store conversation history

Maintain user and assistant messages.

## Trim old messages

Prevent context overflow.

## Validate user input

Check empty requests.

## Handle API errors

Use try/catch.

## Store long-term memory separately

Use databases.

---

# SECTION 12 - Day 33 Mini Project

## AI Chatbot With Conversation Memory

Features:

- Groq API
- Express.js backend
- Multi-turn chat
- Conversation history
- Sliding window
- Reset endpoint
- Error handling

---

# Interview Questions and Answers

---

## Q1. What is a context window?

**Answer:**

A context window is the maximum number of tokens an LLM can process in a single request.

---

## Q2. Does an LLM remember previous conversations automatically?

**Answer:**

No.

The application must send previous messages again with every API request.

---

## Q3. What is the purpose of the messages array?

**Answer:**

The messages array stores conversation history and provides context to the LLM.

---

## Q4. What are the three main message roles?

**Answer:**

1. System - Defines AI behaviour.
2. User - Contains user input.
3. Assistant - Contains previous AI responses.

---

## Q5. Why do production systems use a sliding window?

**Answer:**

Because it:

- Reduces token usage
- Reduces API cost
- Improves speed
- Prevents context limit problems

---

## Q6. What is long-term memory?

**Answer:**

Long-term memory stores information outside the LLM using databases like MongoDB, PostgreSQL, or Redis.

---

## Q7. Why should we not send the entire conversation every time?

**Answer:**

Because:

- It increases cost.
- It increases latency.
- It uses more tokens.
- It may exceed the context window.

---

## Q8. What is conversation summarization?

**Answer:**

Conversation summarization converts old messages into a short summary while keeping important information.

---

## Q9. How do applications like ChatGPT remember conversations?

**Answer:**

They store conversation history and send relevant messages back to the model with each request.

---

## Q10. Why is context management important?

**Answer:**

Context management improves:

- Response quality
- Cost efficiency
- Performance
- Scalability

---

# Day 33 Key Concepts

- Context Window
- Tokens
- Messages Array
- System Prompt
- User Role
- Assistant Role
- Conversation History
- Sliding Window
- Summarization Memory
- Long-Term Memory