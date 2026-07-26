# Day 43 – Multi-Agent Systems (Building Teams of AI Agents)

---

# What is a Multi-Agent System?

A Multi-Agent System (MAS) is an AI architecture where multiple specialized agents collaborate to solve a complex task.

Instead of one AI handling everything, different agents are responsible for different parts of the workflow.

### Single Agent

```
User
   │
   ▼
 AI Agent
   │
   ▼
 Answer
```

### Multi-Agent System

```
User
   │
   ▼
Supervisor Agent
   │
   ├───────────────┬───────────────┬───────────────┐
   ▼               ▼               ▼               ▼
Research      Planner        Developer      Reviewer
Agent         Agent          Agent          Agent
   │               │               │               │
   └───────────────┴───────────────┴───────────────┘
                    │
                    ▼
              Final Response
```

---

# Why Multi-Agent Systems?

Large tasks contain multiple responsibilities.

Example:

Build a Resume Analyzer SaaS

Instead of one AI doing everything,

Split into:

- Research
- Planning
- Development
- Testing
- Review

Each agent focuses on a single responsibility.

Benefits include:

- Better quality
- Easier maintenance
- Scalability
- Parallel execution
- Reusable agents

---

# Components of a Multi-Agent System

## 1. Supervisor Agent

Responsibilities:

- Receive user request
- Break tasks into smaller tasks
- Assign work
- Collect responses
- Generate final output

Think of it as a Project Manager.

---

## 2. Research Agent

Responsibilities

- Search information
- Read documentation
- Suggest technologies
- Gather facts

Example Output

```
Recommended Stack

Node.js
Express
MongoDB
JWT Authentication
```

---

## 3. Planner Agent

Responsibilities

- Create execution plan
- Divide work into steps
- Organize workflow

Example

```
Step 1

Create Project

Step 2

Setup Database

Step 3

Create APIs

Step 4

Testing
```

---

## 4. Coding Agent

Responsibilities

- Generate code
- Fix bugs
- Write APIs
- Implement business logic

---

## 5. Review Agent

Responsibilities

- Check code quality
- Find bugs
- Suggest improvements
- Validate implementation

---

# Multi-Agent Workflow

```
User Request

        │

        ▼

Supervisor

        │

Task Breakdown

        │

        ▼

Research Agent

        │

        ▼

Planner Agent

        │

        ▼

Coding Agent

        │

        ▼

Review Agent

        │

        ▼

Supervisor

        │

        ▼

Final Answer
```

---

# Agent Communication

Agents exchange structured information.

Example

Research Agent

↓

```
Recommended Stack

Node.js

MongoDB

JWT
```

Planner Agent receives research

↓

Creates execution plan

↓

Coding Agent receives plan

↓

Generates implementation

↓

Reviewer checks output

↓

Supervisor returns result

---

# Advantages

- Specialized expertise
- Modular architecture
- Easy debugging
- Reusable agents
- Better scalability
- Higher accuracy
- Easier maintenance

---

# Challenges

- Agent coordination
- Communication overhead
- State management
- Infinite loops
- Error handling
- Increased cost
- Latency due to multiple LLM calls

---

# Common Agent Roles

- Supervisor Agent
- Planner Agent
- Research Agent
- Coding Agent
- Review Agent
- Testing Agent
- Documentation Agent
- Database Agent
- Security Agent
- Deployment Agent

---

# Real-World Examples

## Devin AI

Planner

↓

Coder

↓

Tester

↓

Deployment

---

## Enterprise Support

Customer Request

↓

Support Agent

↓

Knowledge Agent

↓

Database Agent

↓

Response

---

## AI Research Assistant

Research

↓

Fact Checker

↓

Writer

↓

Reviewer

↓

Final Report

---

# LangGraph

LangGraph is a framework for building stateful AI agent workflows.

Core Concepts

- Nodes
- Edges
- Shared State
- Conditional Routing
- Cycles
- Memory

Example

```
Research

↓

Planner

↓

Developer

↓

Reviewer
```

Benefits

- State management
- Parallel execution
- Loop handling
- Human approval steps
- Production-ready workflows

---

# CrewAI

CrewAI is a framework for coordinating multiple AI agents.

Components

Crew

↓

Manager

↓

Workers

↓

Tasks

Each agent has

- Role
- Goal
- Backstory
- Tools

---

# LangGraph vs CrewAI

| Feature             | LangGraph         | CrewAI             |
| ------------------- | ----------------- | ------------------ |
| Workflow            | Graph             | Team               |
| State Management    | Yes               | Limited            |
| Conditional Routing | Yes               | Basic              |
| Parallel Execution  | Yes               | Yes                |
| Memory              | Excellent         | Good               |
| Best For            | Complex workflows | Team collaboration |

---

# Production Architecture

```
Frontend

     │

     ▼

Express API

     │

     ▼

Supervisor Agent

     │

 ┌───┼───────────────┐

 ▼   ▼               ▼

Research Planner Developer

 │       │            │

 └───────┼────────────┘

         ▼

      Review

         ▼

         Tools

         ▼

      Vector DB

         ▼

        Redis

         ▼

        LLM

         ▼

    Final Response
```

---

# Folder Structure

```
day43_multi_agent/

agents/

researchAgent.js

plannerAgent.js

codingAgent.js

reviewAgent.js

supervisorAgent.js

controllers/

agentController.js

routes/

agentRoutes.js

workflows/

agentWorkflow.js

assignment/

ai_team.js

notes/

day43_notes.md

server.js
```

---

# Best Practices

- Give each agent a single responsibility.
- Keep prompts specific for each agent.
- Share only required context.
- Validate outputs before passing to the next agent.
- Prevent infinite loops.
- Log every agent interaction.
- Use structured JSON communication.
- Cache repeated results.
- Add retry mechanisms for failed agents.

---

# Interview Questions and Answers

## Beginner Level

### 1. What is a Multi-Agent System?

**Answer:**

A Multi-Agent System is an architecture where multiple AI agents collaborate to complete a task. Each agent has a specific responsibility, such as research, planning, coding, or reviewing.

---

### 2. Why use multiple agents instead of one?

**Answer:**

Multiple agents specialize in different tasks, making the system more accurate, scalable, modular, and easier to maintain than a single large agent.

---

### 3. What is a Supervisor Agent?

**Answer:**

The Supervisor Agent receives the user's request, divides it into smaller tasks, assigns work to worker agents, collects their outputs, and produces the final response.

---

### 4. What is a Worker Agent?

**Answer:**

A Worker Agent performs a specialized task, such as researching information, creating a plan, generating code, or reviewing outputs.

---

### 5. What is agent collaboration?

**Answer:**

Agent collaboration is the process where multiple agents communicate and share results to solve a larger problem together.

---

## Intermediate Level

### 6. How do agents communicate?

**Answer:**

Agents communicate by passing structured data, usually JSON objects, from one agent to another. Each agent consumes the previous output and produces input for the next stage.

---

### 7. What is task decomposition?

**Answer:**

Task decomposition is the process of breaking a complex task into smaller, manageable subtasks that can be assigned to specialized agents.

---

### 8. What are common agent roles?

**Answer:**

Common roles include:

- Supervisor
- Research
- Planner
- Developer
- Reviewer
- Tester
- Documentation
- Deployment
- Security

---

### 9. What problems do Multi-Agent Systems solve?

**Answer:**

They solve complex workflows requiring multiple skills, such as software development, research automation, customer support, report generation, and enterprise process automation.

---

### 10. How does the Supervisor coordinate workers?

**Answer:**

The Supervisor assigns tasks, monitors execution, collects outputs, handles failures, and combines the results into a final response.

---

## Advanced Level

### 11. What is LangGraph?

**Answer:**

LangGraph is a framework for creating graph-based AI workflows with nodes, edges, shared state, conditional routing, memory, and loop support.

---

### 12. What is CrewAI?

**Answer:**

CrewAI is a framework that models AI agents as a collaborative team where each agent has a defined role, goal, tools, and responsibilities.

---

### 13. How do you prevent infinite agent loops?

**Answer:**

Common techniques include:

- Maximum iteration limits
- State tracking
- Exit conditions
- Timeout handling
- Human approval checkpoints

---

### 14. How would you scale a Multi-Agent System?

**Answer:**

Scale by:

- Running agents in parallel where possible
- Using message queues
- Caching repeated work
- Distributed workers
- Shared memory (Redis)
- Vector databases for retrieval
- Monitoring and observability

---

### 15. How would you add Memory and RAG?

**Answer:**

Memory stores previous interactions for continuity, while Retrieval-Augmented Generation (RAG) retrieves relevant documents from a vector database before generating responses, improving accuracy and reducing hallucinations.

---

# Quick Revision

- Multi-Agent System = Multiple specialized AI agents working together.
- Supervisor coordinates all worker agents.
- Research Agent gathers information.
- Planner Agent creates execution steps.
- Coding Agent implements the solution.
- Review Agent validates quality.
- LangGraph focuses on graph-based workflows with shared state.
- CrewAI focuses on collaborative agent teams.
- Production systems often combine agents with tools, memory, RAG, Redis, vector databases, and monitoring.
