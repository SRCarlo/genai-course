import {
  startSpan,
  endSpan,
  recordSpanError
} from "../observability/tracer.js";

import {
  callGroq
} from "../services/groqClient.js";

import {
  knowledgeSearchTool,
  calculatorTool
} from "../tools/tools.js";

function extractNumberExpression(
  question
) {
  const match =
    question.match(
      /(\d[\d,]*)\s*(?:\*|x|×|of)\s*(\d+(?:\.\d+)?)/i
    );

  if (!match) {
    return null;
  }

  const first =
    Number(
      match[1].replaceAll(
        ",",
        ""
      )
    );

  const second =
    Number(match[2]);

  return `${first} * ${second / 100}`;
}

export async function runAgent(
  question,
  { trace }
) {
  const agentSpan =
    startSpan(
      trace,
      "agent.run",
      {
        question
      }
    );

  try {
    const firstResponse =
      await callGroq({
        trace,

        messages: [
          {
            role: "system",

            content: `
You are an agent for a company
knowledge assistant.

Decide whether the user question
requires knowledge retrieval.

If it concerns company policy,
search the knowledge base.

If it requires arithmetic,
the calculator tool may be used.

Return a concise tool decision.
`
          },

          {
            role: "user",

            content: question
          }
        ]
      });

    const decision =
      firstResponse
        .choices?.[0]
        ?.message
        ?.content || "";

    const shouldSearch =
      /search|knowledge|policy|refund|bonus|leave/i
        .test(
          `${question} ${decision}`
        );

    let context = [];

    if (shouldSearch) {
      context =
        await knowledgeSearchTool({
          query: question,
          trace
        });
    }

    let calculation = null;

    const expression =
      extractNumberExpression(
        question
      );

    if (expression) {
      calculation =
        await calculatorTool({
          expression,
          trace
        });
    }

    const contextText =
      context
        .map(
          item =>
            `Source: ${item.source}\n${item.text}`
        )
        .join("\n\n");

    const finalResponse =
      await callGroq({
        trace,

        messages: [
          {
            role: "system",

            content: `
You are a production company
knowledge assistant.

Answer using the retrieved
context when it is available.

Do not invent company policies.

If a calculation result is
provided, use it.

If the context does not contain
the answer, clearly say that the
available knowledge does not
contain enough information.
`
          },

          {
            role: "user",

            content: `
Question:
${question}

Retrieved context:
${contextText || "No context retrieved."}

Calculation:
${
  calculation !== null
    ? calculation
    : "No calculation performed."
}
`
          }
        ]
      });

    const answer =
      finalResponse
        .choices?.[0]
        ?.message
        ?.content ||
      "Unable to generate an answer.";

    agentSpan.attributes =
      {
        ...agentSpan.attributes,

        retrievedDocuments:
          context.length,

        calculationPerformed:
          calculation !== null,

        finalAnswerLength:
          answer.length
      };

    endSpan(
      agentSpan,
      "success"
    );

    return {
      answer,

      sources:
        context.map(
          item => ({
            documentId:
              item.id,

            source:
              item.source,

            score:
              item.score
          })
        ),

      calculation
    };
  } catch (error) {
    recordSpanError(
      agentSpan,
      error
    );

    throw error;
  }
}