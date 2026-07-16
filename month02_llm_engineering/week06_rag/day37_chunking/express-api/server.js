const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createChunks,
  getChunks,
  readDocument,
} = require("../assignment/chunk_service");

const app = express();

const PORT = 3000;

app.use(express.json());

/*
    Upload Configuration
*/

const uploadFolder = path.join(__dirname, "../data");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },

  filename: function (req, file, cb) {
    cb(
      null,

      Date.now() + "-" + file.originalname,
    );
  },
});

const upload = multer({
  storage,
});

/*
    Home Route
*/

app.get("/", (req, res) => {
  res.json({
    message: "Day 37 Smart Chunking API Running",
  });
});

/*
    POST /upload

    Upload document
*/

app.post("/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded",
    });
  }

  res.json({
    message: "File uploaded successfully",

    file: req.file.filename,
  });
});

/*
    POST /chunk


    Body:

    {
        "file":"filename.txt",
        "type":"recursive"
    }

*/

app.post("/chunk", (req, res) => {
  try {
    const { file, type } = req.body;

    if (!file) {
      return res.status(400).json({
        error: "File name required",
      });
    }

    const filePath = path.join(
      __dirname,

      "../data",

      file,
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    const text = readDocument(filePath);

    const chunks = createChunks(
      text,

      type || "recursive",

      file,
    );

    res.json({
      message: "Chunking completed",

      totalChunks: chunks.length,

      chunks,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

/*
    GET /chunks

    Get stored chunks

*/

app.get("/chunks", (req, res) => {
  const chunks = getChunks();

  res.json({
    total: chunks.length,

    chunks,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
