import { useEffect, useRef, useState } from "react";

function Quiz({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const nextButtonRef = useRef(null);

  const total = Array.isArray(questions) ? questions.length : 0;
  const currentQuestion = questions?.[currentIndex];

  useEffect(() => {
    if (selectedAnswer !== null && nextButtonRef.current) {
      nextButtonRef.current.focus({ preventScroll: true });
    }
  }, [selectedAnswer]);

  if (total === 0) {
    return null;
  }

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === currentQuestion.correctAnswer) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex === total - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const handleKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (selectedAnswer !== null) {
      return;
    }

    const options = currentQuestion.options;
    const optionNumber = Number.parseInt(event.key, 10);

    if (
      Number.isInteger(optionNumber) &&
      optionNumber >= 1 &&
      optionNumber <= options.length
    ) {
      event.preventDefault();
      handleAnswer(optionNumber - 1);
    }
  };

  if (finished) {
    return (
      <section className="quiz-section">
        <div className="quiz-result">
          <p className="eyebrow">QUIZ COMPLETE</p>
          <h2>
            You scored {score} / {total}
          </h2>

          <button type="button" onClick={restartQuiz}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="quiz-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">QUIZ</p>
          <h2>Test your knowledge</h2>
        </div>

        <span>
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div className="quiz-card" key={currentQuestion.id} onKeyDown={handleKeyDown}>
        <h3>{currentQuestion.question}</h3>

        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = currentQuestion.correctAnswer === index;

            let className = "quiz-option";

            if (selectedAnswer !== null && isCorrect) {
              className += " correct";
            } else if (isSelected) {
              className += " incorrect";
            }

            return (
              <button
                key={index}
                type="button"
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="quiz-option-index">{index + 1}</span>

                <span className="quiz-option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {selectedAnswer === null ? (
          <p className="quiz-hint">
            Select an answer with the mouse or press 1 - {currentQuestion.options.length} on your
            keyboard.
          </p>
        ) : (
          <button
            type="button"
            className="quiz-next"
            ref={nextButtonRef}
            onClick={handleNext}
          >
            {currentIndex === total - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        )}
      </div>
    </section>
  );
}

export default Quiz;
