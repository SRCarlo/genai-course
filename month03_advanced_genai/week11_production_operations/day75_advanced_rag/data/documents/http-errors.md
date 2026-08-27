# HTTP Errors

HTTP 429 Too Many Requests indicates that the client has sent too many
requests in a given amount of time.

An HTTP 429 response may include a Retry-After header.

The Retry-After header tells a client how long it should wait before
making another request.

Applications should use retry strategies with exponential backoff
when appropriate.

For APIs, rate limiting protects services from excessive traffic.

HTTP 500 represents an internal server error.

HTTP 401 indicates that authentication is required or invalid.

HTTP 403 indicates that the client is authenticated but does not have
permission to access the requested resource.
