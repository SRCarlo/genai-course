# Authorization

Authentication answers **who are you?** Authorization answers **what are you allowed to do?**

The application checks permissions after authentication and tenant resolution.

- `401` = missing/invalid identity.
- `403` = identity is known, but the action is forbidden.

The LLM is never trusted to enforce authorization.
