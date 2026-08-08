"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question.");
      setAnswer("");
      setSources([]);
      setMetadata(null);
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);
    setMetadata(null);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get an answer.");
      }

      setAnswer(data.answer || "No answer returned.");

      setSources(Array.isArray(data.sources) ? data.sources : []);

      setMetadata(data.metadata || null);
    } catch (err) {
      console.error("Chat request failed:", err);

      setError(err.message || "Unable to connect to the RAG backend.");
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setQuestion("");
    setAnswer("");
    setSources([]);
    setMetadata(null);
    setError("");
  }

  return (
    <main className="page-container">
      <section className="chat-card">
        <header className="header">
          <div>
            <p className="eyebrow">DAY 56 · PRODUCTION RAG</p>

            <h1>AI Knowledge Assistant</h1>

            <p className="subtitle">
              Ask questions about your technical knowledge base.
            </p>
          </div>
        </header>

        <form onSubmit={askQuestion} className="question-form">
          <label htmlFor="question">Your question</label>

          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Example: How does Express middleware work?"
            rows={4}
            disabled={loading}
          />

          <div className="button-row">
            <button type="submit" disabled={loading}>
              {loading ? "Thinking..." : "Ask Question"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={clearChat}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <section className="error-box">
            <strong>Error</strong>
            <p>{error}</p>
          </section>
        )}

        {loading && (
          <section className="loading-box">
            <div className="spinner"></div>

            <div>
              <strong>Searching knowledge base...</strong>

              <p>
                Running hybrid retrieval, reranking, context selection and LLM
                generation.
              </p>
            </div>
          </section>
        )}

        {answer && !loading && (
          <section className="answer-section">
            <div className="section-heading">
              <h2>Answer</h2>
            </div>

            <div className="answer-box">
              <p>{answer}</p>
            </div>
          </section>
        )}

        {sources.length > 0 && (
          <section className="sources-section">
            <div className="section-heading">
              <h2>Sources</h2>

              <span className="source-count">{sources.length}</span>
            </div>

            <div className="sources-list">
              {sources.map((source, index) => (
                <div
                  className="source-card"
                  key={`${source.source || "source"}-${index}`}
                >
                  <span className="source-number">{index + 1}</span>

                  <div>
                    <strong>
                      {source.source || source.file || "Unknown source"}
                    </strong>

                    {source.category && <p>Category: {source.category}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {metadata && (
          <section className="metadata-section">
            <h2>Request Information</h2>

            <div className="metadata-grid">
              {metadata.retrievedDocuments !== undefined && (
                <div className="metadata-item">
                  <span>Retrieved</span>
                  <strong>{metadata.retrievedDocuments}</strong>
                </div>
              )}

              {metadata.latencyMs !== undefined && (
                <div className="metadata-item">
                  <span>Latency</span>
                  <strong>{metadata.latencyMs} ms</strong>
                </div>
              )}

              {metadata.cacheHit !== undefined && (
                <div className="metadata-item">
                  <span>Cache</span>
                  <strong>{metadata.cacheHit ? "HIT" : "MISS"}</strong>
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
