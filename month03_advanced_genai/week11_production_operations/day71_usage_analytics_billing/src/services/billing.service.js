import { env } from "../config/env.js";

const plans = {
  free: {
    monthlyTokens: 100_000,
    monthlyBudget: 1,
  },

  pro: {
    monthlyTokens: 2_000_000,
    monthlyBudget: 25,
  },

  enterprise: {
    monthlyTokens: 20_000_000,
    monthlyBudget: 500,
  },
};

export function getPlan(planName) {
  return plans[planName] || plans.free;
}

export function calculateBilling({ providerCost, markup = 3 }) {
  const customerCharge = providerCost * markup;

  const grossMargin = customerCharge - providerCost;

  return {
    providerCost: Number(providerCost.toFixed(8)),

    customerCharge: Number(customerCharge.toFixed(8)),

    grossMargin: Number(grossMargin.toFixed(8)),
  };
}

export function getPlans() {
  return plans;
}

export function getDefaultBudget() {
  return env.defaultMonthlyBudget;
}
