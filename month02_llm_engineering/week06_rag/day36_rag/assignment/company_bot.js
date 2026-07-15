import getEmbedding from "../embeddings/generate.js";

import { add, search } from "../vector-db/vectorStore.js";

import { ask } from "../llm/groq.js";

// Company policies

const policies = [
  {
    id: 1,
    text: "Employees receive 20 paid leaves every year.",
  },

  {
    id: 2,
    text: "Remote work is allowed three days per week.",
  },

  {
    id: 3,
    text: "Salary is credited on the last working day of every month.",
  },

  {
    id: 4,
    text: "Employees must complete security training every year.",
  },

  {
    id: 5,
    text: "Office working hours are from 9 AM to 6 PM.",
  },

  {
    id: 6,
    text: "Employees can request medical leave with proper documents.",
  },

  {
    id: 7,
    text: "Performance reviews happen twice a year.",
  },

  {
    id: 8,
    text: "Employees receive health insurance benefits.",
  },

  {
    id: 9,
    text: "New employees have a three month probation period.",
  },

  {
    id: 10,
    text: "Employees should follow company security policies.",
  },
];

// Create vectors

async function loadPolicies() {
  for (const policy of policies) {
    const embedding = await getEmbedding(policy.text);

    add(policy.text, embedding);

    console.log("Added:", policy.text);
  }

  console.log("Company policy database ready");
}

// Ask company bot

async function companyBot(question) {
  const questionEmbedding = await getEmbedding(question);

  const results = search(questionEmbedding, 3);

  const context = results.map((item) => item.text).join("\n");

  const prompt = `

You are a company policy assistant.

Answer only using the policies below.


Policies:

${context}


Question:

${question}


Answer:

`;

  const answer = await ask(prompt);

  console.log("\nQuestion:");
  console.log(question);

  console.log("\nAnswer:");
  console.log(answer);
}

// Run

async function start() {
  await loadPolicies();

  await companyBot("How many paid leaves do employees get?");
}

start();
