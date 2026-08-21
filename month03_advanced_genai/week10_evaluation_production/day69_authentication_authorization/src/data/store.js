import bcrypt from "bcrypt";

const userPasswords = {
  user1: "User12345!",
  user2: "User12345!",
  admin1: "Admin12345!",
};

const createHash = async (password) => {
  return bcrypt.hash(password, 12);
};

const user1Hash = await createHash(userPasswords.user1);
const user2Hash = await createHash(userPasswords.user2);
const adminHash = await createHash(userPasswords.admin1);

export const users = [
  {
    id: "user_1",
    email: "user1@example.com",
    passwordHash: user1Hash,
    role: "user",
    tenantId: "tenant_a",
    plan: "free",
  },
  {
    id: "user_2",
    email: "user2@example.com",
    passwordHash: user2Hash,
    role: "user",
    tenantId: "tenant_b",
    plan: "free",
  },
  {
    id: "admin_1",
    email: "admin@example.com",
    passwordHash: adminHash,
    role: "admin",
    tenantId: "tenant_a",
    plan: "enterprise",
  },
];

export const documents = [
  {
    id: "doc_a1",
    ownerId: "user_1",
    tenantId: "tenant_a",
    title: "Tenant A Refund Policy",
    content: "Tenant A refunds are available within 30 days of purchase.",
  },
  {
    id: "doc_a2",
    ownerId: "admin_1",
    tenantId: "tenant_a",
    title: "Tenant A Internal Policy",
    content: "Tenant A enterprise customers receive priority support.",
  },
  {
    id: "doc_b1",
    ownerId: "user_2",
    tenantId: "tenant_b",
    title: "Tenant B Refund Policy",
    content: "Tenant B refunds are available within 14 days of purchase.",
  },
];

export const refreshTokens = new Map();

export const apiKeys = [
  {
    id: "key_1",
    name: "Tenant A Development Key",
    key: "day69_test_api_key_tenant_a",
    tenantId: "tenant_a",
    userId: "user_1",
    scopes: ["chat:write", "documents:read"],
  },
];

export const quotaUsage = new Map();

export const rateLimitStore = new Map();
