const API_URL = "http://localhost:3001";

export async function generateStudyKit(input) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
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

  if (!result?.success || !result?.data) {
    throw new Error("The server returned an invalid study kit.");
  }

  return result.data;
}