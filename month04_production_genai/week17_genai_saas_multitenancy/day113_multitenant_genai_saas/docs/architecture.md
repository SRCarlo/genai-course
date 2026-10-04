# Day 113 Architecture

```text
CLIENT
  |
  v
API Gateway
  |
  v
API Key Authentication
  |
  v
Authenticated Identity
  |
  v
Tenant Resolution
  |
  v
Tenant Policy
  |
  +--> Rate Limit
  +--> Token Budget
  +--> Model Permission
  |
  v
AI Gateway
  |
  +--> Tenant-Aware Cache
  +--> Tenant-Aware RAG
  |
  v
Groq API
  |
  v
openai/gpt-oss-20b
  |
  v
Usage Meter
  |
  v
Cost Tracker / Billing
```

The security boundary is the authenticated tenant identity.

The client must not be trusted to select another tenant by sending a tenantId in
the request body.

For production, tenant filters must also be enforced in the persistence layer and
vector database layer, not only in application code.
