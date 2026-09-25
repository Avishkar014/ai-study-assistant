import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { studyKitSchema } from "../validation/studyKitSchema.js";

dotenv.config({
  path: "../.env",
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

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Study Assistant API is running",
  });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== "string" || !input.trim()) {
      return res.status(400).json({
        error: "Study topic or notes are required.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a study kit from the following content:

${input}

Return ONLY valid JSON. Do not include markdown, code fences, or explanatory text.

The JSON must have exactly this structure:

{
  "cards": [
    {
      "id": "string",
      "question": "string",
      "answer": "string",
      "difficulty": "easy | medium | hard"
    }
  ],
  "quiz": [
    {
      "id": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0
    }
  ]
}

Generate exactly 5 flashcards and exactly 5 quiz questions.

For quiz questions, correctAnswer must be the zero-based index of the correct option.`,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      return res.status(502).json({
        error: "The AI returned an empty response.",
      });
    }

    let parsedData;

    try {
      parsedData = JSON.parse(response.text);
    } catch {
      return res.status(502).json({
        error: "The AI returned invalid JSON.",
      });
    }

    const validationResult = studyKitSchema.safeParse(parsedData);

    if (!validationResult.success) {
      console.error(
        "Study kit validation failed:",
        validationResult.error.issues
      );

      return res.status(502).json({
        error: "The AI returned an invalid study kit format.",
      });
    }

    return res.json({
      success: true,
      data: validationResult.data,
    });
  } catch (error) {
    console.error("Generation error:", error);

    if (
      error?.status === 429 ||
      error?.code === 429 ||
      error?.message?.includes("429") ||
      error?.message?.toLowerCase().includes("quota")
    ) {
      return res.status(429).json({
        error:
          "AI generation quota has been reached. Please try again later.",
      });
    }

    if (
      error?.message?.includes("API key") ||
      error?.message?.includes("authentication") ||
      error?.message?.includes("credentials")
    ) {
      return res.status(401).json({
        error: "AI authentication failed. Check your LLM_API_KEY.",
      });
    }

    return res.status(500).json({
      error: "Failed to generate study kit.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});