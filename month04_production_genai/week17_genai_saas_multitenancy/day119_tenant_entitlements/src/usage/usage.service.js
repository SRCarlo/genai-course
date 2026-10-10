import { randomUUID } from "node:crypto";

export class InMemoryUsageService {
  #usage = new Map();
  #reservations = new Map();

  getKey(tenantId, period) {
    return `${tenantId}:${period}`;
  }

  async getUsage(tenantId, period) {
    const usage = this.#usage.get(this.getKey(tenantId, period));
    return usage ? { ...usage } : { tokens: 0, requests: 0, reservedTokens: 0, reservedRequests: 0 };
  }

  // In-memory reservation is atomic only within this single Node.js process.
  // Use a database transaction or atomic quota service for multiple instances.
  async reserve({ tenantId, period, estimatedTokens, limits }) {
    if (
      !tenantId ||
      !period ||
      !Number.isSafeInteger(estimatedTokens) ||
      estimatedTokens < 0 ||
      !limits ||
      !Number.isSafeInteger(limits.monthlyTokens) ||
      !Number.isSafeInteger(limits.monthlyRequests)
    ) {
      throw new Error("INVALID_USAGE_RESERVATION");
    }

    const key = this.getKey(tenantId, period);
    const current = this.#usage.get(key) ?? {
      tokens: 0, requests: 0, reservedTokens: 0, reservedRequests: 0
    };

    if (current.requests + current.reservedRequests >= limits.monthlyRequests) {
      throw new Error("REQUEST_QUOTA_EXCEEDED");
    }
    if (current.tokens + current.reservedTokens + estimatedTokens > limits.monthlyTokens) {
      throw new Error("TOKEN_QUOTA_EXCEEDED");
    }

    const reservationId = randomUUID();
    const next = {
      ...current,
      reservedTokens: current.reservedTokens + estimatedTokens,
      reservedRequests: current.reservedRequests + 1
    };
    this.#usage.set(key, next);
    this.#reservations.set(reservationId, { key, estimatedTokens, settled: false });
    return reservationId;
  }

  async reconcile({ reservationId, actualTokens }) {
    if (!Number.isSafeInteger(actualTokens) || actualTokens < 0) {
      throw new Error("INVALID_ACTUAL_USAGE");
    }

    const reservation = this.#reservations.get(reservationId);
    if (!reservation || reservation.settled) {
      throw new Error("INVALID_USAGE_RESERVATION");
    }

    const current = this.#usage.get(reservation.key);
    const next = {
      tokens: current.tokens + actualTokens,
      requests: current.requests + 1,
      reservedTokens: current.reservedTokens - reservation.estimatedTokens,
      reservedRequests: current.reservedRequests - 1
    };

    if (next.tokens < 0 || next.reservedTokens < 0 || next.reservedRequests < 0) {
      throw new Error("USAGE_ACCOUNTING_INVARIANT_FAILED");
    }

    this.#usage.set(reservation.key, next);
    reservation.settled = true;
    this.#reservations.delete(reservationId);
    return { ...next };
  }

  async release({ reservationId }) {
    const reservation = this.#reservations.get(reservationId);
    if (!reservation || reservation.settled) {
      throw new Error("INVALID_USAGE_RESERVATION");
    }

    const current = this.#usage.get(reservation.key);
    this.#usage.set(reservation.key, {
      ...current,
      reservedTokens: current.reservedTokens - reservation.estimatedTokens,
      reservedRequests: current.reservedRequests - 1
    });
    reservation.settled = true;
    this.#reservations.delete(reservationId);
  }

  async resetForTests() {
    this.#usage.clear();
    this.#reservations.clear();
  }
}
