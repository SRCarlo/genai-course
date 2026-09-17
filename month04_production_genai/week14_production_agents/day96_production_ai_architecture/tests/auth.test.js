import request from "supertest";

import { describe, it, expect } from "vitest";

import app from "../src/app.js";

describe("Authentication middleware", () => {
  it("should attach user identity", async () => {
    const response = await request(app)
      .post("/api/chat")
      .set("x-user-id", "test-user")
      .set("x-tenant-id", "test-tenant")
      .send({
        message: "Hello",
      });

    expect(response.status).not.toBe(401);
  });
});
