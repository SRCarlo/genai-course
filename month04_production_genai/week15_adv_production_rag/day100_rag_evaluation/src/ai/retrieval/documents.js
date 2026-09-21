export const documents = [
  {
    id: "auth-password-reset",
    title: "Password Reset",
    text: "Users can reset their password from the account settings page. Open Settings, choose Security, select Reset Password, and follow the password reset flow.",
  },
  {
    id: "http-401",
    title: "HTTP 401 Unauthorized",
    text: "HTTP 401 means the request lacks valid authentication credentials. Check the access token, API key, login session, and Authorization header.",
  },
  {
    id: "http-403",
    title: "HTTP 403 Forbidden",
    text: "HTTP 403 means the server understood the request but refuses to authorize it. Check permissions, roles, and resource access.",
  },
  {
    id: "oauth",
    title: "OAuth",
    text: "OAuth is an authorization framework that allows an application to obtain limited access to a resource on behalf of a user without sharing the user's password.",
  },
  {
    id: "api-authentication",
    title: "API Authentication",
    text: "For APIs, use a supported authentication method such as OAuth bearer tokens or API keys. Protect credentials and send them using the required Authorization mechanism.",
  },
  {
    id: "jwt",
    title: "JWT",
    text: "A JSON Web Token can carry signed claims between parties. APIs commonly validate the signature and claims before accepting a request.",
  },
  {
    id: "refresh-token",
    title: "Refresh Tokens",
    text: "A refresh token can be exchanged for a new access token when the access token expires, subject to the authorization server's policy.",
  },
  {
    id: "password-security",
    title: "Password Security",
    text: "Use long unique passwords, avoid password reuse, enable multi-factor authentication where available, and never share credentials.",
  },
  {
    id: "employee-vacation",
    title: "Vacation Policy",
    text: "Employees should request vacation through the company's approved leave workflow. Approval depends on the applicable team and company policy.",
  },
  {
    id: "company-history",
    title: "Company History",
    text: "The company began as a small software team and expanded its products over time.",
  },
  {
    id: "api-rate-limit",
    title: "API Rate Limits",
    text: "API rate limits restrict how many requests a client can make during a time window. Clients should handle rate-limit responses with controlled retries and backoff.",
  },
  {
    id: "timeout",
    title: "Request Timeouts",
    text: "A request timeout means an operation did not complete within the configured time limit. Check downstream latency, network conditions, and timeout configuration.",
  },
  {
    id: "logging",
    title: "Application Logging",
    text: "Production logs should include request identifiers, event names, useful metadata, error types, and timestamps while avoiding secrets and sensitive data.",
  },
  {
    id: "observability",
    title: "Observability",
    text: "Observability combines logs, metrics, and traces to help engineers understand what happened inside a system.",
  },
  {
    id: "rag",
    title: "RAG",
    text: "Retrieval augmented generation retrieves relevant evidence and provides that evidence to a language model before generating an answer.",
  },
  {
    id: "hybrid-search",
    title: "Hybrid Search",
    text: "Hybrid search combines different retrieval signals, such as keyword search and vector similarity, to improve retrieval coverage.",
  },
  {
    id: "reranking",
    title: "Reranking",
    text: "A reranker takes an initial candidate set and scores candidates for relevance so the most useful evidence can be placed near the top.",
  },
  {
    id: "recall-precision",
    title: "Retrieval Metrics",
    text: "Recall@K measures whether relevant documents appear in the top K results. Precision@K measures how much of the top K result set is relevant.",
  },
  {
    id: "mrr",
    title: "Mean Reciprocal Rank",
    text: "MRR measures the reciprocal rank of the first relevant result. A relevant result appearing earlier produces a higher score.",
  },
  {
    id: "llm-grounding",
    title: "Grounded Answers",
    text: "A grounded answer should be supported by the evidence supplied to the model. Unsupported claims are a faithfulness problem.",
  },
  {
    id: "quality-gates",
    title: "Quality Gates",
    text: "A quality gate compares measured evaluation metrics with predefined thresholds and can stop a deployment when quality requirements are not met.",
  },
  {
    id: "golden-dataset",
    title: "Golden Dataset",
    text: "A golden dataset contains representative questions and expected relevant documents or answer characteristics. It is used for regression testing.",
  },
  {
    id: "ci-rag",
    title: "CI for RAG",
    text: "A RAG CI pipeline can run unit tests, integration tests, evaluation datasets, metric calculations, and quality gates before deployment.",
  },
  {
    id: "token-usage",
    title: "Token Usage",
    text: "Track input tokens, output tokens, and total tokens because token usage affects cost, latency, context utilization, and scalability.",
  },
  {
    id: "request-id",
    title: "Request IDs",
    text: "Every production request should have a unique request ID so retrieval, reranking, LLM calls, errors, latency, and logs can be correlated.",
  },
];
