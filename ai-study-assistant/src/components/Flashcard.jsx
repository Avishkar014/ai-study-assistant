import { useState } from "react";

function Flashcard({ card }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleClick = () => {
    setShowAnswer((current) => !current);
  };

  return (
    <div className="flashcard" onClick={handleClick}>
      <div className="flashcard-top">
        <span className="flashcard-type">
          {showAnswer ? "ANSWER" : "QUESTION"}
        </span>

        <span className="flashcard-difficulty">
          {card.difficulty}
        </span>
      </div>

      <div className="flashcard-body">
        {!showAnswer ? (
          <>
            <p className="flashcard-label">Question</p>

            <h3 className="flashcard-question">
              {card.question}
            </h3>

            <p className="flashcard-hint">
              Click to reveal the answer
            </p>
          </>
        ) : (
          <>
            <p className="flashcard-label">Answer</p>

            <p className="flashcard-answer">
              {card.answer}
            </p>

            <p className="flashcard-hint">
              Click to see the question
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Flashcard;