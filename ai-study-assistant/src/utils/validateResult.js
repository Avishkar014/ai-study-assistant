const DIFFICULTIES = ["easy", "medium", "hard"];

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFlashcardData(data) {
  return (
    Boolean(data) &&
    hasText(data.question) &&
    hasText(data.answer) &&
    DIFFICULTIES.includes(data.difficulty)
  );
}

function isQuizData(data) {
  return (
    Boolean(data) &&
    hasText(data.question) &&
    Array.isArray(data.options) &&
    data.options.length === 4 &&
    data.options.every(hasText) &&
    Number.isInteger(data.correctAnswer) &&
    data.correctAnswer >= 0 &&
    data.correctAnswer < data.options.length
  );
}

function isChecklistData(data) {
  return (
    Boolean(data) &&
    hasText(data.title) &&
    Array.isArray(data.items) &&
    data.items.length > 0 &&
    data.items.every(hasText)
  );
}

function isChartData(data) {
  return (
    Boolean(data) &&
    hasText(data.title) &&
    hasText(data.description) &&
    Array.isArray(data.labels) &&
    Array.isArray(data.values) &&
    data.labels.length > 0 &&
    data.labels.length === data.values.length &&
    data.labels.every(hasText) &&
    data.values.every((value) => Number.isFinite(value))
  );
}

export function isValidBlock(block) {
  if (!block || typeof block !== "object" || !hasText(block.id)) {
    return false;
  }

  switch (block.type) {
    case "flashcard":
      return isFlashcardData(block.data);

    case "quiz":
      return isQuizData(block.data);

    case "checklist":
      return isChecklistData(block.data);

    case "chart":
      return isChartData(block.data);

    default:
      return false;
  }
}

export function validateStudyKit(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (!hasText(data.title)) {
    return false;
  }

  if (!Array.isArray(data.blocks) || data.blocks.length === 0) {
    return false;
  }

  return data.blocks.every(isValidBlock);
}
