# Tenant Isolation

Every request must resolve a tenant from authenticated identity.

Isolation must apply to:

- relational/document databases
- vector databases
- object storage
- Redis/cache
- conversation history
- usage records
- billing records
- logs and telemetry

## Safe RAG pattern

```js
documents.filter(
  (document) =>
    document.tenantId === authenticatedTenantId &&
    document.text.includes(query)
);
```

## Unsafe pattern

```js
documents.filter(
  (document) => document.text.includes(query)
);
```

The unsafe pattern can return another customer's information.
