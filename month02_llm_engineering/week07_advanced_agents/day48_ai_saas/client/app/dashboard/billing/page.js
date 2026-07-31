"use client";

import { useState } from "react";

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("Free");

  const plans = [
    {
      name: "Free",

      price: "₹0",

      period: "Forever",

      requests: "100 AI Requests",

      features: ["Resume Analysis", "Basic AI Feedback", "Usage Dashboard"],
    },

    {
      name: "Pro",

      price: "₹999",

      period: "per month",

      requests: "5000 AI Requests",

      features: [
        "Advanced AI Analysis",

        "Unlimited Resume History",

        "Priority Processing",
      ],
    },

    {
      name: "Enterprise",

      price: "Custom",

      period: "Contact Sales",

      requests: "Unlimited Requests",

      features: ["Team Accounts", "Admin Dashboard", "Dedicated Support"],
    },
  ];

  const upgrade = (plan) => {
    setCurrentPlan(plan);

    alert(`${plan} plan selected`);
  };

  return (
    <div>
      <h1
        className="
text-4xl
font-bold
mb-3
"
      >
        Billing & Subscription 💳
      </h1>

      <p
        className="
text-gray-500
mb-8
"
      >
        Manage your AI usage and subscription
      </p>

      <div
        className="
bg-white
rounded-2xl
shadow
p-6
mb-8
"
      >
        <h2
          className="
text-xl
font-bold
"
        >
          Current Plan
        </h2>

        <div
          className="
flex
justify-between
items-center
mt-4
"
        >
          <div>
            <p
              className="
text-3xl
font-bold
text-blue-600
"
            >
              {currentPlan}
            </p>

            <p
              className="
text-gray-500
"
            >
              1000 AI requests remaining
            </p>
          </div>

          <span
            className="
bg-green-100
text-green-700
px-4
py-2
rounded-full
"
          >
            Active
          </span>
        </div>
      </div>

      <div
        className="
grid
md:grid-cols-3
gap-6
"
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`
bg-white
rounded-2xl
shadow
p-6
border-2

${currentPlan === plan.name ? "border-blue-600" : "border-transparent"}

`}
          >
            <h2
              className="
text-2xl
font-bold
"
            >
              {plan.name}
            </h2>

            <div
              className="
mt-4
"
            >
              <span
                className="
text-4xl
font-bold
"
              >
                {plan.price}
              </span>

              <span
                className="
text-gray-500
"
              >
                / {plan.period}
              </span>
            </div>

            <p
              className="
mt-4
font-semibold
text-blue-600
"
            >
              {plan.requests}
            </p>

            <ul
              className="
mt-5
space-y-3
text-gray-600
"
            >
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <button
              onClick={() => upgrade(plan.name)}
              className="
mt-8
w-full
bg-blue-600
text-white
py-3
rounded-xl
hover:bg-blue-700
"
            >
              {currentPlan === plan.name ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
