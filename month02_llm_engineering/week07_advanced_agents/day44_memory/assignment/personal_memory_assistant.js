import express from "express";
import dotenv from "dotenv";

import {
  rememberFact,
  recallFact,
  recallAll,
} from "../memory/memoryManager.js";

import { storeMemory, searchMemory } from "../vector-memory/retrieval.js";

dotenv.config();

const app = express();

app.use(express.json());

/*
SAVE MEMORY

POST /memory/save

Body:

{
    "key":"language",
    "value":"Node.js"
}

*/
app.post("/memory/save", async (req, res) => {
  try {
    const { key, value } = req.body;

    // Redis Memory

    await rememberFact(key, value);

    // Vector Memory

    await storeMemory(`${key}: ${value}`);

    res.json({
      success: true,

      message: "Memory saved",

      memory: {
        key,
        value,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
});

/*
GET ALL MEMORY


GET /memory/history

*/

app.get("/memory/history", async (req, res) => {
  try {
    const memories = await recallAll();

    res.json({
      success: true,

      memories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
});

/*
SEARCH MEMORY


POST /memory/search


Body:

{
 "query":"backend technology"
}

*/

app.post("/memory/search", async (req, res) => {
  try {
    const { query } = req.body;

    const result = await searchMemory(query);

    res.json({
      success: true,

      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
});

/*
GET SINGLE MEMORY


GET /memory/:key

*/

app.get("/memory/:key", async (req, res) => {
  try {
    const value = await recallFact(req.params.key);

    res.json({
      success: true,

      value,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Personal Memory Assistant running on ${PORT}`);
});
