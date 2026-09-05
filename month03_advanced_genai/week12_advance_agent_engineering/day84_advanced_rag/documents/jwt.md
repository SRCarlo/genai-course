# JWT Authentication

JSON Web Tokens are commonly used for authentication and authorization.

## Access Tokens

An access token is typically short-lived and is sent with authenticated requests.

## Refresh Tokens

A refresh token can be used to obtain a new access token after the access token expires.

Refresh token rotation can reduce the risk associated with stolen refresh tokens.

## JWT Validation

A server should validate the JWT signature, expiration, issuer, audience, and other claims as required by the application.
