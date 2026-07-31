# DAY 48 — AI SaaS Development

# 1. Today's Goal

Today we learned how to combine AI components into a complete AI SaaS product.

By the end of Day 48, we understand:

- What AI SaaS is
- SaaS Architecture
- Authentication
- User Management
- Subscription Plans
- Usage Tracking
- Billing Concepts
- Multi-Tenant Systems
- AI Product Design
- Production AI Startup Architecture

---

# 2. What is AI SaaS?

SaaS = Software as a Service

AI SaaS is a software product that provides AI capabilities through the internet.

Examples:

- ChatGPT
- Notion AI
- Grammarly
- Cursor
- Jasper AI
- Perplexity

## User Flow

```
Signup

↓

Login

↓

Use AI Features

↓

Pay Subscription

↓

Continue Using Product
```

---

# 3. AI SaaS Architecture

```
Frontend
(Next.js)

↓

Authentication

↓

Backend API
(Express.js)

↓

AI Service

↓

LLM Provider
(Groq/OpenAI)

↓

Database

↓

Response
```

---

# 4. Real SaaS Examples

## ChatGPT

Features:

- Authentication
- Conversation History
- Subscription
- Usage Limits
- Payments

## Cursor

Features:

- User Accounts
- Projects
- AI Coding
- Usage Tracking
- Premium Plans

## Perplexity

Features:

- Search
- AI Answers
- Premium Features
- User Management

---

# 5. Project Folder Structure

```
day48_ai_saas

│
├── client
│
├── server
│
├── database
│
├── notes
│
├── .env
│
└── README.md
```

---

# 6. SaaS Components

Every AI SaaS needs:

## Authentication

Includes:

- Signup
- Login
- JWT
- Sessions

## User Management

Includes:

- Users
- Profiles
- Roles
- Permissions

## AI Engine

Providers:

- Groq
- OpenAI
- Anthropic
- Gemini

## Database

Options:

- MongoDB
- PostgreSQL

## Payments

Providers:

- Stripe
- Razorpay
- PayPal

---

# 7. Authentication System

Authentication Flow:

```
Signup

↓

Hash Password

↓

Store User

↓

Login

↓

Generate JWT

↓

Access Protected Routes
```

Required packages:

```
express

bcrypt

jsonwebtoken

mongoose
```

---

# 8. User Model

Example:

```javascript
{
name:"Ninja",

email:"ninja@gmail.com",

password:"hashed_password",

plan:"free",

usage:0
}
```

Important fields:

## plan

Subscription level:

```
free

pro

enterprise
```

## usage

Number of AI requests used by user.

---

# 9. Password Hashing

Passwords should never be stored directly.

Example:

```javascript
bcrypt.hash(password, 10);
```

Benefits:

- Protect user passwords
- Prevent data leaks

---

# 10. JWT Authentication

JWT = JSON Web Token

Flow:

```
User Login

↓

Verify Password

↓

Generate JWT

↓

Send Token

↓

Access Protected APIs
```

Example:

```javascript
jwt.sign(
  {
    userId: user._id,
  },
  JWT_SECRET,
);
```

---

# 11. AI Service Layer

AI logic should be separated.

Architecture:

```
Controller

↓

AI Service

↓

Groq/OpenAI

↓

Response
```

Benefits:

- Clean architecture
- Easy model switching
- Better maintenance

---

# 12. Groq AI Integration

Example:

```javascript
const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",

  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});
```

---

# 13. Usage Tracking

Every AI request:

```
User

↓

AI Request

↓

Process Request

↓

Increase Usage Count

↓

Save Database
```

Example:

```javascript
user.usage += 1;

await user.save();
```

Purpose:

- Control cost
- Prevent abuse
- Track user activity

---

# 14. Subscription Plans

Example:

## Free Plan

```
100 Requests
```

## Pro Plan

```
5000 Requests
```

## Enterprise

```
Unlimited
```

Database:

```javascript
plan: "free";
```

---

# 15. Usage Limit Middleware

Middleware checks user limits.

Flow:

```
Request

↓

Check User Plan

↓

Check Usage

↓

Allow Request

OR

Reject Request
```

Purpose:

- Protect AI API
- Manage expenses
- Enforce plans

---

# 16. Multi-Tenant Architecture

Multi-tenancy means multiple customers use one application while keeping data separated.

Bad:

```
All Users

↓

Same Data
```

Good:

```
User A

↓

Own Data


User B

↓

Own Data
```

Each user can access only their own information.

---

# 17. SaaS Dashboard

Dashboard displays:

- User name
- Current plan
- Usage
- Remaining requests
- AI history
- Billing

Example API:

```
GET /dashboard
```

Response:

```json
{
  "plan": "pro",

  "usage": 350,

  "remaining": 4650
}
```

---

# 18. Billing System

Payment Flow:

```
User Upgrade

↓

Payment Gateway

↓

Payment Success

↓

Webhook

↓

Update User Plan

↓

Unlock Features
```

Payment Providers:

- Stripe
- Razorpay
- PayPal

---

# 19. Environment Variables

Sensitive values:

```
PORT

MONGO_URI

JWT_SECRET

GROQ_API_KEY

STRIPE_SECRET_KEY
```

Never commit:

```
.env

node_modules
```

Add them to:

```
.gitignore
```

---

# 20. Production Architecture

## Startup Level

```
Next.js

↓

Express

↓

MongoDB

↓

Groq
```

## Growth Stage

```
Next.js

↓

Express

↓

Redis

↓

PostgreSQL

↓

Groq
```

## Enterprise Level

```
Frontend

↓

API Gateway

↓

Microservices

↓

Redis

↓

Vector Database

↓

LLM

↓

Monitoring
```

---

# 21. SaaS Security

Important security practices:

## Password Hashing

Use bcrypt

## Authentication

Use JWT

## Rate Limiting

Prevent API abuse

## Input Validation

Prevent attacks

## HTTPS

Encrypt communication

---

# 22. AI Resume Analyzer SaaS Project

Project Features:

- User Signup
- Login
- JWT Authentication
- Resume Upload
- AI Resume Analysis
- Usage Tracking
- Subscription Plans

Technology Stack:

Frontend:

```
Next.js
```

Backend:

```
Express.js
```

Database:

```
MongoDB
```

AI:

```
Groq
```

Authentication:

```
JWT
```

---

# 23. Interview Questions

## Beginner

### What is SaaS?

Software delivered through the internet using a subscription model.

### What is AI SaaS?

A SaaS product that provides AI-powered features.

### Why use JWT?

For secure authentication between client and server.

### Why hash passwords?

To protect user credentials.

---

## Intermediate

### What is multi-tenancy?

Multiple users share the same application while their data remains isolated.

### How does subscription work?

Users select plans and get features according to their plan.

### What is usage tracking?

Tracking how much AI service a user consumes.

---

## Advanced

### Design ChatGPT Architecture

```
Frontend

↓

API Layer

↓

Authentication

↓

AI Service

↓

LLM

↓

Database
```

### How to control AI cost?

Solutions:

- Usage limits
- Rate limiting
- Caching
- Smaller models
- Monitoring

### How to secure customer data?

Solutions:

- Authentication
- Authorization
- Encryption
- Data isolation

---

```

```
