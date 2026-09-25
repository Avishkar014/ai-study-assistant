import { validateStudyKit } from "../utils/validateResult";

const API_URL = "http://localhost:3001";

function createFallbackError(message) {
  const error = new Error(message);
  error.canFallback = true;
  return error;
}

function parseEventFrame(frame) {
  const line = frame.split("\n").find((entry) => entry.startsWith("data:"));

  if (!line) {
    return null;
  }

  try {
    return JSON.parse(line.slice(5).trim());
  } catch {
    return null;
  }
}

async function requestStudyKit(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please make sure the backend is running."
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      result?.error || `Request failed with status ${response.status}.`
    );
  }

  if (!result?.success || !validateStudyKit(result.data)) {
    throw new Error("The server returned an invalid study kit.");
  }

  return result.data;
}

async function readStreamBody(body, handleEvent) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const frames = buffer.split("\n\n");
      buffer = frames.pop();

      frames.forEach((frame) => handleEvent(parseEventFrame(frame)));
    }
  } catch {
    throw createFallbackError("The streaming response was interrupted.");
  }

  handleEvent(parseEventFrame(buffer));
}

export function generateStudyKit(input) {
  return requestStudyKit("/api/generate", { input });
}

export function refineStudyKit(studyKit, instruction) {
  return requestStudyKit("/api/refine", { studyKit, instruction });
}

export async function generateStudyKitStream(input, onProgress) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/generate/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });
  } catch {
    throw createFallbackError("The streaming endpoint could not be reached.");
  }

  if (!response.ok) {
    if (response.status === 404 || response.status === 405) {
      throw createFallbackError("Streaming is not available on this server.");
    }

    const errorBody = await response.json().catch(() => null);

    throw new Error(
      errorBody?.error || `Request failed with status ${response.status}.`
    );
  }

  if (!response.body) {
    throw createFallbackError("The streaming response is not readable.");
  }

  const stream = { studyKit: null, error: "" };

  await readStreamBody(response.body, (event) => {
    if (!event) {
      return;
    }

    if (event.type === "progress" && typeof onProgress === "function") {
      onProgress({
        blocks: Number.isFinite(event.blocks) ? event.blocks : 0,
        characters: Number.isFinite(event.characters) ? event.characters : 0,
      });
      return;
    }

    if (event.type === "result") {
      stream.studyKit = event.data;
      return;
    }

    if (event.type === "error") {
      stream.error =
        typeof event.message === "string" && event.message
          ? event.message
          : "The AI could not finish the study kit.";
    }
  });

  if (stream.error) {
    throw new Error(stream.error);
  }

  if (!validateStudyKit(stream.studyKit)) {
    throw createFallbackError(
      "The stream ended before a complete study kit was received."
    );
  }

  return stream.studyKit;
}
