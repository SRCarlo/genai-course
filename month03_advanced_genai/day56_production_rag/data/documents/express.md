# Express.js

Express is a web framework for Node.js.

It provides routing, middleware support, request and response handling, and utilities for building HTTP APIs.

An Express application typically creates an app instance and registers middleware and routes.

Example:

const express = require("express");
const app = express();

app.get("/", (req, res) => {
res.json({ message: "Hello" });
});

Middleware functions can access the request object, response object, and the next function.
