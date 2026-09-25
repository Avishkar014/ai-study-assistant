const API_BASE_URL = "http://localhost:3001";

export async function generateStudyKit(input, signal) {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to generate study kit.");
  }

  return response.json();
}