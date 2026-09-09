# Day 88 Notes — AI Agent Identity & Authorization

## Core principle

> The LLM decides what it wants to do. The application decides what it is allowed to do.

## Security flow

Authentication -> User Identity -> AI Agent -> Tool Request -> Tool Gateway -> User Permission -> Agent Permission -> Resource Authorization -> Argument Validation -> Risk Policy -> Human Approval -> Tool Execution -> Audit Log

## Key concepts

- Authentication answers: Who are you?
- Authorization answers: What are you allowed to do?
- RBAC maps roles to permissions.
- ABAC evaluates attributes such as user, resource, action, ownership and risk.
- Least privilege reduces blast radius.
- Delegated authorization constrains an agent by both user and agent permissions.
- Resource-level authorization prevents access to another user's resources.
- A tool gateway is the security boundary between the LLM and tools.
- High-risk and critical tools can require human approval.
- Audit logs should capture security-relevant events without unnecessarily storing sensitive data.

## Groq

This project uses Groq with `openai/gpt-oss-20b`. The model is used only as a planning layer. It does not bypass the authorization gateway.
