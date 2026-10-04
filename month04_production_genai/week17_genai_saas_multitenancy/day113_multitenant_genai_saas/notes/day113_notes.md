# Day 113 — GenAI SaaS & Multi-Tenancy

## Multi-Tenancy

One platform serves multiple independent customers while maintaining logical
isolation between their data, users and policies.

## Core flow

Identity -> Tenant -> Policy -> Limit -> Data Isolation -> AI -> Usage -> Billing

## Authentication

Authentication establishes who is making a request.

API key -> user -> tenant

Tenant identity should normally come from authenticated identity.

## Authorization

Authorization determines what an authenticated identity can do.

Examples:

- allowed models
- allowed documents
- administrative operations
- API key management
- tenant configuration

## Plans

FREE:
- low rate limit
- low token budget
- limited models

PRO:
- higher rate limit
- higher token budget
- more models

ENTERPRISE:
- highest limits
- premium models
- custom policies

## Tenant-Aware RAG

Retrieval must filter by authenticated tenant before returning documents.

## Tenant-Aware Cache

Cache keys should include tenant context, model, prompt and knowledge version.

## Usage Metering

Record:

- tenant
- user
- model
- input tokens
- output tokens
- total tokens
- timestamp

## Cost Tracking

The project estimates Groq provider cost from model pricing.

## Database isolation

1. Shared database + tenant_id
2. Separate schema
3. Separate database

Shared database is cheaper but requires strong tenant filtering.
Separate databases provide stronger isolation but increase operational complexity.

## Day 113 principle

Tenant identity is a security boundary.
