import 'dotenv/config';

import Groq from 'groq-sdk';

const MODEL = 'openai/gpt-oss-20b';

async function main() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing. Configure it in your terminal.');
  }

  const groq = new Groq({
    apiKey,
    timeout: 30_000,
    maxRetries: 2,
  });

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Reply concisely.',
      },
      {
        role: 'user',
        content: 'Reply with exactly: Groq API connection successful',
      },
    ],
    max_completion_tokens: 256,
    reasoning_effort: 'low',
    include_reasoning: false,
  });

  const answer = response.choices?.[0]?.message?.content;

  if (typeof answer !== 'string' || answer.trim() === '') {
    throw new Error('Groq returned an empty response.');
  }
}

main().catch((error) => {
  console.error('Groq API test failed:', error.message);
  process.exitCode = 1;
});
