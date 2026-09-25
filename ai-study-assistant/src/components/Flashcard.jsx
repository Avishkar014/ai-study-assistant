function Flashcard({ card, flipped, onToggle }) {
  return (
    <button
      type="button"
      className={flipped ? "flashcard show-answer" : "flashcard"}
      onClick={onToggle}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? "Answer revealed. Activate to show the question."
          : "Activate to reveal the answer."
      }
    >
      <span className="flashcard-top">
        <span className="flashcard-type">
          {flipped ? "ANSWER" : "QUESTION"}
        </span>

        <span className={`flashcard-difficulty ${card.difficulty}`}>
          {card.difficulty}
        </span>
      </span>

      <span className="flashcard-body" key={flipped ? "answer" : "question"}>
        {flipped ? (
          <>
            <span className="flashcard-label">Answer</span>

            <span className="flashcard-answer">{card.answer}</span>

            <span className="flashcard-hint">
              Press Space or click to see the question
            </span>
          </>
        ) : (
          <>
            <span className="flashcard-label">Question</span>

            <span className="flashcard-question">{card.question}</span>

            <span className="flashcard-hint">
              Press Space or click to reveal the answer
            </span>
          </>
        )}
      </span>
    </button>
  );
}

export default Flashcard;
