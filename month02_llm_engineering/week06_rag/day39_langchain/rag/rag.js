import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FakeEmbeddings } from "@langchain/core/utils/embeddings";
import { Document } from "@langchain/core/documents";

// Sample knowledge base

const documents = [
  new Document({
    pageContent:
      "LangChain is a framework used to build LLM applications using chains, agents, tools and retrieval.",
  }),

  new Document({
    pageContent:
      "RAG stands for Retrieval Augmented Generation. It combines document retrieval with language models.",
  }),

  new Document({
    pageContent:
      "Vector databases store embeddings and help AI systems find similar information.",
  }),
];

// Split documents

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(documents);

// Create vector store

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  new FakeEmbeddings({
    size: 1536,
  }),
);

// Retriever

const retriever = vectorStore.asRetriever();

export default retriever;
