import { createEmbedding } from "../../ai/embeddings/embedding.service.js";
const rawDocuments = [
  {
    id: "auth-password-reset",
    title: "How to reset your password",
    content:
      "To reset your password, open the account security page, choose Forgot Password, verify your email, and create a new password.",
    metadata: {
      source: "auth-password-reset.md",
    },
  },
  {
    id: "http-401",
    title: "HTTP 401 Unauthorized Error",
    content:
      "HTTP 401 means the request lacks valid authentication credentials. Check the Authorization header, access token, token expiry, and login session.",
    metadata: {
      source: "http-401.md",
    },
  },
  {
    id: "oauth-guide",
    title: "OAuth Authentication Guide",
    content:
      "OAuth allows an application to obtain delegated access using an authorization flow. Configure the client ID, redirect URI, authorization endpoint, token endpoint, and scopes.",
    metadata: {
      source: "oauth-guide.md",
    },
  },
  {
    id: "api-rate-limit",
    title: "API Rate Limiting",
    content:
      "API rate limiting protects services from excessive traffic. A 429 response normally indicates that the client exceeded the allowed request rate.",
    metadata: {
      source: "api-rate-limit.md",
    },
  },
  {
    id: "payment-failure",
    title: "Payment Failure Troubleshooting",
    content:
      "For payment failures, verify the payment method, billing address, gateway response code, transaction status, and retry policy.",
    metadata: {
      source: "payment-failure.md",
    },
  },
  {
    id: "product-sku",
    title: "Product SKU Lookup",
    content:
      "Product SKUs are exact identifiers used to locate inventory items. Search SKU values with keyword matching when an exact product code is known.",
    metadata: {
      source: "product-sku.md",
    },
  },
  {
    id: "database-timeout",
    title: "Database Timeout Troubleshooting",
    content:
      "Database timeout errors can be caused by slow queries, unavailable connections, network latency, exhausted connection pools, or database overload.",
    metadata: {
      source: "database-timeout.md",
    },
  },
  {
    id: "api-versioning",
    title: "API Versioning",
    content:
      "API versions should be explicit in the request path or negotiated through headers. Check the API documentation before migrating clients between versions.",
    metadata: {
      source: "api-versioning.md",
    },
  },
  {
    id: "username-change",
    title: "Changing a Username",
    content:
      "Users can change a username from account settings when the organization policy allows it. Some usernames may be reserved or require administrator approval.",
    metadata: {
      source: "username-change.md",
    },
  },
  {
    id: "login-troubleshooting",
    title: "Login Troubleshooting",
    content:
      "If login fails, verify the username, password, account status, multi-factor authentication, browser session, and authentication provider configuration.",
    metadata: {
      source: "login-troubleshooting.md",
    },
  },
];
const documents = rawDocuments.map((document) => ({
  ...document,
  embedding: createEmbedding(`${document.title} ${document.content}`),
}));
export const documentRepository = {
  async findAll() {
    return documents;
  },
  async findById(id) {
    return documents.find((d) => d.id === id) || null;
  },
};
