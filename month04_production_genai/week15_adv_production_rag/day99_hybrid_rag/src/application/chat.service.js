import { QueryRewriter } from "../ai/query/query.rewriter.js";
import { QueryExpander } from "../ai/query/query.expander.js";
import { VectorSearch } from "../ai/retrieval/vector.search.js";
import { KeywordSearch } from "../ai/retrieval/keyword.search.js";
import { HybridSearch } from "../ai/retrieval/hybrid.search.js";
import { Reranker } from "../ai/retrieval/reranker.js";
import { LLMService } from "../ai/llm/llm.service.js";
import { RAGService } from "../ai/rag/rag.service.js";
import { documentRepository } from "../infrastructure/repositories/inMemory.document.repository.js";

const llmService = new LLMService();
const vectorSearch = new VectorSearch({ repository: documentRepository });
const keywordSearch = new KeywordSearch({ repository: documentRepository });
const hybridSearch = new HybridSearch({ vectorSearch, keywordSearch });
const ragService = new RAGService({
  queryRewriter: new QueryRewriter({ llmService }),
  queryExpander: new QueryExpander({ llmService }),
  hybridSearch,
  reranker: new Reranker({ llmService }),
  llmService,
});
export const chatService = {
  ask: ({ question, conversation }) =>
    ragService.run({ question, conversation }),
};
