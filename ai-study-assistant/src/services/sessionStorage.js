const STORAGE_KEY = "ai-study-assistant-sessions";
const MAX_SESSIONS = 10;

function isSession(value) {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.title === "string" &&
    value.title.length > 0 &&
    typeof value.originalInput === "string" &&
    typeof value.createdAt === "string" &&
    Boolean(value.studyKit) &&
    typeof value.studyKit === "object" &&
    Array.isArray(value.studyKit.blocks) &&
    value.studyKit.blocks.length > 0
  );
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function writeSessions(sessions) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(sessions.slice(0, MAX_SESSIONS))
    );

    return true;
  } catch (error) {
    console.error("Unable to save study sessions:", error);

    return false;
  }
}

export function getSessions() {
  let stored;

  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("Unable to read study sessions:", error);

    return [];
  }

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isSession).slice(0, MAX_SESSIONS);
  } catch (error) {
    console.error("Corrupted study sessions were discarded:", error);

    return [];
  }
}

export function createSession(studyKit, originalInput) {
  return {
    id: createId(),
    title: studyKit.title,
    originalInput,
    studyKit,
    createdAt: new Date().toISOString(),
  };
}

export function saveSession(session) {
  const sessions = [session, ...getSessions().filter((item) => item.id !== session.id)];

  return writeSessions(sessions);
}

export function updateSession(id, studyKit) {
  const sessions = getSessions().map((session) =>
    session.id === id
      ? { ...session, title: studyKit.title, studyKit }
      : session
  );

  return writeSessions(sessions);
}

export function deleteSession(id) {
  return writeSessions(getSessions().filter((session) => session.id !== id));
}
