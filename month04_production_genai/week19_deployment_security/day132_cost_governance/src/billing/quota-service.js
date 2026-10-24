const MICRODOLLARS_PER_DOLLAR = 1_000_000;

function toMicrodollars(amountDollars) {
  if (!Number.isFinite(amountDollars) || amountDollars < 0) {
    throw new TypeError("amountDollars must be non-negative");
  }

  const amount = Math.round(amountDollars * MICRODOLLARS_PER_DOLLAR);

  if (!Number.isSafeInteger(amount)) {
    throw new RangeError("Amount exceeds supported precision");
  }

  return amount;
}

function createQuotaService() {
  const accounts = new Map();
  const reservations = new Map();

  function configureTenant(tenantId, budgetDollars) {
    if (typeof tenantId !== "string" || !tenantId.trim()) {
      throw new TypeError("tenantId is required");
    }

    const budget = toMicrodollars(budgetDollars);
    const existing = accounts.get(tenantId);

    if (existing && existing.reserved > 0) {
      throw new Error("Cannot reset an account with active reservations");
    }

    accounts.set(tenantId, {
      budget,
      spent: 0,
      reserved: 0,
    });
  }

  function reserve({ tenantId, requestId, estimatedCostDollars }) {
    const account = accounts.get(tenantId);

    if (!account) {
      throw new Error("Tenant budget is not configured");
    }

    if (typeof requestId !== "string" || !requestId.trim()) {
      throw new TypeError("requestId is required");
    }

    if (reservations.has(requestId)) {
      throw new Error("Duplicate reservation requestId");
    }

    const amount = toMicrodollars(estimatedCostDollars);
    const available = account.budget - account.spent - account.reserved;

    if (amount > available) {
      return { allowed: false, reason: "BUDGET_EXCEEDED" };
    }

    account.reserved += amount;
    reservations.set(requestId, {
      tenantId,
      reserved: amount,
      status: "RESERVED",
    });

    return { allowed: true, requestId };
  }

  function settle({ requestId, actualCostDollars }) {
    const reservation = reservations.get(requestId);

    if (!reservation || reservation.status !== "RESERVED") {
      throw new Error("Active reservation not found");
    }

    const actual = toMicrodollars(actualCostDollars);
    const account = accounts.get(reservation.tenantId);

    account.reserved -= reservation.reserved;
    account.spent += actual;
    reservation.status = "SETTLED";
    reservation.actual = actual;

    return {
      spentDollars: account.spent / MICRODOLLARS_PER_DOLLAR,
      reservedDollars: account.reserved / MICRODOLLARS_PER_DOLLAR,
    };
  }

  function release(requestId) {
    const reservation = reservations.get(requestId);

    if (!reservation || reservation.status !== "RESERVED") {
      throw new Error("Active reservation not found");
    }

    const account = accounts.get(reservation.tenantId);
    account.reserved -= reservation.reserved;
    reservation.status = "RELEASED";
  }

  function getBalance(tenantId) {
    const account = accounts.get(tenantId);

    if (!account) {
      throw new Error("Tenant budget is not configured");
    }

    return {
      budgetDollars: account.budget / MICRODOLLARS_PER_DOLLAR,
      spentDollars: account.spent / MICRODOLLARS_PER_DOLLAR,
      reservedDollars: account.reserved / MICRODOLLARS_PER_DOLLAR,
      availableDollars:
        (account.budget - account.spent - account.reserved) /
        MICRODOLLARS_PER_DOLLAR,
    };
  }

  return {
    configureTenant,
    reserve,
    settle,
    release,
    getBalance,
  };
}

module.exports = { createQuotaService };
