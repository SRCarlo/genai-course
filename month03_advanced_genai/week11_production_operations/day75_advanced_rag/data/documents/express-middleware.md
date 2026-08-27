# Express Middleware

Express middleware functions have access to the request object,
response object, and the next middleware function.

Middleware can be used for authentication, logging, validation,
request transformation, authorization, and error handling.

A middleware function commonly calls next() to pass control to the
next middleware.

Example:

app.use(express.json());

Authentication middleware should verify credentials before protected
routes execute.

Authorization middleware should verify whether the authenticated user
has permission to perform an operation.
