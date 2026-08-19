# Day 67 — Production Node.js Deployment

Production-ready GenAI API using:

- Node.js
- Express
- Groq
- Helmet
- Rate limiting

Docker is intentionally not used.

## Architecture

Client
↓
Node.js
↓
Express
↓
Security
↓
Validation
↓
Groq
↓
Response

## Requirements

- Node.js 22+
- npm
- Groq API key

## Installation

```bash
npm install
```
