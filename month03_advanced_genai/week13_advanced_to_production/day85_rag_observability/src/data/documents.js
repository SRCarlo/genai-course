export const documents = [
  {
    id: "http-errors.md",
    title: "HTTP Errors",
    content: `
HTTP 400 means Bad Request.
HTTP 401 means Unauthorized.
HTTP 403 means Forbidden.
HTTP 404 means Not Found.
HTTP 409 means Conflict.
HTTP 429 means Too Many Requests.

HTTP 429 indicates that the client has sent too many requests
within a given period. Servers may use rate limiting to protect
their resources.

HTTP 500 means Internal Server Error.
HTTP 502 means Bad Gateway.
HTTP 503 means Service Unavailable.
HTTP 504 means Gateway Timeout.
`
  },

  {
    id: "jwt-guide.md",
    title: "JWT Authentication",
    content: `
JSON Web Token, commonly called JWT, is a compact token format
used for securely transmitting claims between parties.

A JWT normally contains a header, payload and signature.

Access tokens are generally short-lived. Refresh tokens can be
used to obtain new access tokens without requiring the user to
authenticate again.

Applications should protect refresh tokens carefully.
`
  },

  {
    id: "oauth-guide.md",
    title: "OAuth",
    content: `
OAuth is an authorization framework that allows applications to
obtain limited access to resources on behalf of a user.

OAuth is different from authentication.

OAuth flows can involve access tokens and refresh tokens.
`
  },

  {
    id: "node-basics.md",
    title: "Node.js Basics",
    content: `
Node.js is a JavaScript runtime built on Chrome's V8 engine.

Node.js uses an event-driven architecture and is commonly used
for backend services, APIs, command-line applications and
real-time applications.

npm is the default package manager commonly used with Node.js.
`
  },

  {
    id: "express-routing.md",
    title: "Express Routing",
    content: `
Express is a web framework for Node.js.

Routes define how an application responds to HTTP requests.

An Express route commonly contains an HTTP method, a path and
a callback function.

GET is commonly used to retrieve resources.
POST is commonly used to create resources.
PUT and PATCH are commonly used to update resources.
DELETE is commonly used to remove resources.
`
  },

  {
    id: "database-indexing.md",
    title: "Database Indexing",
    content: `
Database indexes improve lookup performance by creating a data
structure that helps the database locate records efficiently.

Indexes can improve read performance but require additional
storage and may increase the cost of writes.

Indexes should be designed according to actual query patterns.
`
  },

  {
    id: "deployment.md",
    title: "Production Deployment",
    content: `
Production services should use environment variables for secrets
and configuration.

Applications should expose health checks and should produce
structured logs.

Production systems should monitor latency, error rates and
resource consumption.

Sensitive information such as API keys, passwords and private
authorization headers should never be written to ordinary logs.
`
  }
];