# Authentication and Authorization

Authentication verifies the identity of a user.

Authorization determines whether an authenticated user is allowed to
perform a particular action.

JWTs can be used to carry claims between a client and server.

Sensitive documents should be protected by authorization checks before
retrieval.

Multi-tenant applications must ensure that users can only retrieve
documents belonging to their tenant.

The tenant identifier should come from trusted authentication context,
not directly from an untrusted user query.
