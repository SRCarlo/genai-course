# Day 110 — Production AI Architecture & High Availability

## Stack

- Node.js
- Express
- Groq API
- openai/gpt-oss-20b
- dotenv

## Setup

npm install
copy .env.example .env

# Add GROQ_API_KEY to .env

## Run

npm run dev

## Health

GET /health/live
GET /health/ready

## Generate

POST /api/generate
Content-Type: application/json

{"prompt":"Explain high availability in simple words."}

## Tests

npm test
