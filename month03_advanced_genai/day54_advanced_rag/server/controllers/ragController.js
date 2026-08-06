import { transformQuery } from "../services/queryTransformService.js";
import { hybridSearch } from "../services/hybridSearchService.js";
import { rerank } from "../services/rerankerService.js";
import { buildContext } from "../services/contextBuilder.js";
import { askOllama } from "../services/ollamaService.js";

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required.",
      });
    }

    const searchQuery = transformQuery(question);

    const retrieved = await hybridSearch(searchQuery);

    const topDocs = rerank(searchQuery, retrieved);

    const context = buildContext(topDocs);

    const answer = await askOllama(question, context);

    res.json({
      question,
      transformedQuery: searchQuery,
      answer,
      sources: topDocs.map((doc) => ({
        file: doc.source,
        score: doc.rerankScore,
      })),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
}
