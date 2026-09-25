export function validateStudyKit(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (!Array.isArray(data.cards) || data.cards.length === 0) {
    return false;
  }

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return false;
  }

  const validCards = data.cards.every(
    (card) =>
      card &&
      typeof card.id === "string" &&
      typeof card.question === "string" &&
      typeof card.answer === "string" &&
      ["easy", "medium", "hard"].includes(card.difficulty)
  );

  const validQuiz = data.quiz.every(
    (question) =>
      question &&
      typeof question.id === "string" &&
      typeof question.question === "string" &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((option) => typeof option === "string") &&
      Number.isInteger(question.correctAnswer) &&
      question.correctAnswer >= 0 &&
      question.correctAnswer < question.options.length
  );

  return validCards && validQuiz;
}