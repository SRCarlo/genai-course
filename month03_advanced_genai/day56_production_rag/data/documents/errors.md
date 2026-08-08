# Error Handling

Backend applications should handle errors explicitly.

Express applications can use error-handling middleware.

An Express error handler has the signature:

(err, req, res, next)

Applications should return appropriate HTTP status codes and avoid exposing sensitive internal information.