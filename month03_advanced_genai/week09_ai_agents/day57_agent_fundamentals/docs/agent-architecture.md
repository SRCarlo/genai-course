# Day 57 Agent Architecture

## Overview

The Day 57 application is a Node.js
tool-calling AI Agent using the Groq API.

---

## Architecture

```text
                    USER
                      |
                      v
               Express API
                      |
                      v
                 Agent Loop
                      |
                      v
                  Groq LLM
                      |
             +--------+--------+
             |        |        |
             v        v        v
        Calculator   Time    Knowledge
             |        |        |
             +--------+--------+
                      |
                      v
                 Tool Result
                      |
                      v
                  Groq LLM
                      |
               +------+------+
               |             |
            Tool Call      Final
               |             |
               +----->-------+
                      |
                      v
                    User
```
