import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import {
  MODEL,
  buildGenerationPrompt,
  buildRefinementPrompt,
  countBlocks,
  describeAiError,
  parseRefinementRequest,
  parseStudyInput,
  parseStudyKit,
  requestStudyKit,
} from "./studyKit.js";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

const app = express();
const PORT = 3001;

if (!process.env.LLM_API_KEY) {
  console.error("LLM_API_KEY is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.LLM_API_KEY,
});

app.use(cors());
app.use(express.json());

function writeEvent(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Study Assistant API is running",
  });
});

app.post("/api/generate", async (req, res) => {
  const parsedInput = parseStudyInput(req.body?.input);

  if (parsedInput.error) {
    return res.status(400).json({
      error: parsedInput.error,
    });
  }

  const result = await requestStudyKit(
    ai,
    buildGenerationPrompt(parsedInput.value),
    "Failed to generate study kit."
  );

  if (result.error) {
    return res.status(result.status).json({
      error: result.error,
    });
  }

  return res.json({
    success: true,
    data: result.data,
  });
});

app.post("/api/generate/stream", async (req, res) => {
  const parsedInput = parseStudyInput(req.body?.input);

  if (parsedInput.error) {
    return res.status(400).json({
      error: parsedInput.error,
    });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents: buildGenerationPrompt(parsedInput.value),
      config: {
        responseMimeType: "application/json",
      },
    });

    let text = "";
    let streamedBlocks = 0;
    let streamedCharacters = 0;

    for await (const chunk of stream) {
      if (res.writableEnded) {
        return;
      }

      if (chunk.text) {
        text += chunk.text;
      }

      const blocks = countBlocks(text);

      if (
        blocks !== streamedBlocks ||
        text.length - streamedCharacters >= 200
      ) {
        streamedBlocks = blocks;
        streamedCharacters = text.length;

        writeEvent(res, {
          type: "progress",
          blocks,
          characters: text.length,
        });
      }
    }

    if (res.writableEnded) {
      return;
    }

    const result = parseStudyKit(text);

    if (result.error) {
      writeEvent(res, {
        type: "error",
        status: result.status,
        message: result.error,
      });
    } else {
      writeEvent(res, { type: "result", data: result.data });
    }
  } catch (error) {
    const failure = describeAiError(error, "Failed to generate study kit.");

    if (!res.writableEnded) {
      writeEvent(res, {
        type: "error",
        status: failure.status,
        message: failure.message,
      });
    }
  }

  res.end();
});

app.post("/api/refine", async (req, res) => {
  const parsedRequest = parseRefinementRequest(req.body);

  if (parsedRequest.error) {
    return res.status(parsedRequest.status).json({
      error: parsedRequest.error,
    });
  }

  const result = await requestStudyKit(
    ai,
    buildRefinementPrompt(parsedRequest.studyKit, parsedRequest.instruction),
    "Failed to refine the study kit."
  );

  if (result.error) {
    return res.status(result.status).json({
      error: result.error,
    });
  }

  return res.json({
    success: true,
    data: result.data,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});