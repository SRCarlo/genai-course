import http from "node:http";
import "dotenv/config";

import { CacheService } from "./cache/cache-service.js";
import { createCacheKey } from "./cache/cache-key.js";
import { RequestDeduplicator } from "./cache/request-dedup.js";
import { LLMService } from "./llm/llm-service.js";
import { CacheMetrics } from "./metrics/cache-metrics.js";

const cache = new CacheService({
  maxEntries: 1000,
  ttlMs: 5 * 60 * 1000,
});

const llm = new LLMService();
const metrics = new CacheMetrics();
const deduplicator = new RequestDeduplicator();

const PORT = process.env.PORT || 3000;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    // --------------------------------
    // Health Check
    // --------------------------------
    if (req.method === "GET" && req.url === "/") {
      return sendJson(res, 200, {
        success: true,
        message: "Day 108 LLM Caching API is running",
        model: llm.model,
      });
    }

    // --------------------------------
    // Cache Metrics
    // --------------------------------
    if (req.method === "GET" && req.url === "/api/cache/metrics") {
      return sendJson(res, 200, metrics.getStats());
    }

    // --------------------------------
    // Clear Cache
    // --------------------------------
    if (req.method === "DELETE" && req.url === "/api/cache") {
      cache.clear();

      return sendJson(res, 200, {
        success: true,
        message: "Cache cleared",
      });
    }

    // --------------------------------
    // Chat
    // --------------------------------
    if (req.method === "POST" && req.url === "/api/chat") {
      const body = await readBody(req);

      const {
        query,
        tenantId = "default",
        userId = "demo-user",
        temperature = 0.2,
        language = "en",
      } = body;

      // Validation
      if (!query || typeof query !== "string") {
        return sendJson(res, 400, {
          success: false,
          error: "query is required and must be a string",
        });
      }

      // --------------------------------
      // Create deterministic cache key
      // --------------------------------
      const cacheKey = createCacheKey({
        tenantId,
        userId,
        model: llm.model,
        promptVersion: "v1",
        contextVersion: "v1",
        query,
        temperature,
        language,
      });

      // --------------------------------
      // CACHE LOOKUP
      // --------------------------------
      const cached = cache.get(cacheKey);

      if (cached) {
        metrics.recordHit();

        return sendJson(res, 200, {
          success: true,
          response: cached.response,
          source: "cache",
          model: llm.model,
          cacheKey,
        });
      }

      // --------------------------------
      // CACHE MISS
      // --------------------------------
      metrics.recordMiss();

      // --------------------------------
      // REQUEST DEDUPLICATION
      //
      // If multiple identical requests
      // arrive at the same time, only
      // one Groq request is executed.
      // --------------------------------
      const result = await deduplicator.run(cacheKey, async () => {
        const generated = await llm.generate({
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant.",
            },
            {
              role: "user",
              content: query,
            },
          ],
          temperature,
        });

        // Store generated response
        cache.set(cacheKey, {
          response: generated.response,
        });

        return generated;
      });

      // --------------------------------
      // Return Groq response
      // --------------------------------
      return sendJson(res, 200, {
        success: true,
        response: result.response,
        source: "groq",
        model: llm.model,
        cacheKey,
      });
    }

    // --------------------------------
    // Route Not Found
    // --------------------------------
    return sendJson(res, 404, {
      success: false,
      error: "Route not found",
    });
  } catch (error) {
    console.error(error);

    return sendJson(res, 500, {
      success: false,
      error: error.message,
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("");
  console.log("Endpoints:");
  console.log("GET    /");
  console.log("POST   /api/chat");
  console.log("GET    /api/cache/metrics");
  console.log("DELETE /api/cache");
  console.log("");
});
