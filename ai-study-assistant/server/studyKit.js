import { studyKitSchema } from "../validation/studyKitSchema.js";

export const MODEL = "gemini-2.5-flash";

const STUDY_KIT_FORMAT = `{
  "title": "string",
  "blocks": [
    {
      "id": "block-1",
      "type": "flashcard",
      "data": {
        "question": "string",
        "answer": "string",
        "difficulty": "easy | medium | hard"
      }
    },
    {
      "id": "block-2",
      "type": "quiz",
      "data": {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": 0
      }
    },
    {
      "id": "block-3",
      "type": "checklist",
      "data": {
        "title": "string",
        "items": ["string"]
      }
    },
    {
      "id": "block-4",
      "type": "chart",
      "data": {
        "title": "string",
        "description": "string",
        "labels": ["string"],
        "values": [0]
      }
    }
  ]
}`;

const STUDY_KIT_RULES = `Rules:
- "blocks" must contain exactly 10 blocks in this order: 5 flashcard blocks, then 1 checklist block, then 3 quiz blocks, then 1 chart block.
- Every block id must be unique and sequential: "block-1" through "block-10".
- "difficulty" must be exactly one of "easy", "medium", "hard".
- Quiz "options" must contain exactly 4 non-empty strings, and "correctAnswer" must be the zero-based index of the correct option.
- Checklist "items" must contain between 3 and 6 non-empty strings.
- Chart "labels" and "values" must have the same length, between 3 and 6 entries, and every value must be a number.
- Include only the properties shown above. Do not add extra properties.
- Keep every string concise and self-contained.`;

export function buildGenerationPrompt(input) {
  return `Create a study kit from the following content:

${input}

Return ONLY valid JSON. Do not include markdown, code fences, or explanatory text.

The JSON must have exactly this structure:

${STUDY_KIT_FORMAT}

${STUDY_KIT_RULES}

Write the title as a short study topic label.`;
}

export function buildRefinementPrompt(studyKit, instruction) {
  return `You are updating an existing study kit.

Current study kit:

${JSON.stringify(studyKit)}

User instruction: ${instruction}

Apply the instruction and return the COMPLETE updated study kit as ONLY valid JSON. Do not include markdown, code fences, or explanatory text.

The JSON must have exactly this structure:

${STUDY_KIT_FORMAT}

${STUDY_KIT_RULES}

Keep the blocks the instruction does not change exactly as they are, including their ids and their order. Update the title only when the instruction changes the focus of the study kit.`;
}

export function parseStudyInput(input) {
  if (!input || typeof input !== "string" || !input.trim()) {
    return { error: "Study topic or notes are required." };
  }

  const value = input.trim();

  if (value.length > 5000) {
    return { error: "Please keep the study content under 5000 characters." };
  }

  return { value };
}

export function parseRefinementRequest(body) {
  const instruction =
    typeof body?.instruction === "string" ? body.instruction.trim() : "";

  if (!instruction) {
    return { status: 400, error: "A refinement instruction is required." };
  }

  if (instruction.length > 400) {
    return { status: 400, error: "Please keep the instruction under 400 characters." };
  }

  if (!body?.studyKit || typeof body.studyKit !== "object") {
    return { status: 400, error: "A study kit is required for refinement." };
  }

  const validationResult = studyKitSchema.safeParse(body.studyKit);

  if (!validationResult.success) {
    return { status: 400, error: "The study kit to refine is invalid." };
  }

  return { studyKit: validationResult.data, instruction };
}

function stripCodeFences(text) {
  const trimmed = text.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```[a-z]*\s*/i, "")
    .replace(/\s*```$/, "");
}

export function parseStudyKit(text) {
  if (!text || !text.trim()) {
    return { status: 502, error: "The AI returned an empty response." };
  }

  let parsedData;

  try {
    parsedData = JSON.parse(stripCodeFences(text));
  } catch {
    return { status: 502, error: "The AI returned invalid JSON." };
  }

  const validationResult = studyKitSchema.safeParse(parsedData);

  if (!validationResult.success) {
    console.error("Study kit validation failed:", validationResult.error.issues);

    return { status: 502, error: "The AI returned an invalid study kit format." };
  }

  return { data: validationResult.data };
}

export function describeAiError(error, fallbackMessage) {
  console.error("AI request failed:", error);

  if (
    error?.status === 429 ||
    error?.code === 429 ||
    error?.message?.includes("429") ||
    error?.message?.toLowerCase().includes("quota")
  ) {
    return {
      status: 429,
      message: "AI generation quota has been reached. Please try again later.",
    };
  }

  if (
    error?.status === 401 ||
    error?.status === 403 ||
    error?.message?.includes("API key") ||
    error?.message?.includes("authentication") ||
    error?.message?.includes("credentials")
  ) {
    return {
      status: 401,
      message: "AI authentication failed. Check your LLM_API_KEY.",
    };
  }

  return { status: 500, message: fallbackMessage };
}

export function countBlocks(text) {
  const matches = text.match(/"type"\s*:\s*"(flashcard|quiz|checklist|chart)"/g);

  return matches ? matches.length : 0;
}

export async function requestStudyKit(ai, prompt, fallbackMessage) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return parseStudyKit(response.text);
  } catch (error) {
    const failure = describeAiError(error, fallbackMessage);

    return { status: failure.status, error: failure.message };
  }
}
