import { useState } from "react";

function Quiz({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

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
    if (currentIndex === questions.length - 1) {
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

  if (finished) {
    return (
      <section className="quiz-section">
        <div className="quiz-result">
          <p className="eyebrow">QUIZ COMPLETE</p>
          <h2>You scored {score} / {questions.length}</h2>

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
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="quiz-card">
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
                key={option}
                type="button"
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <button
            type="button"
            className="quiz-next"
            onClick={handleNext}
          >
            {currentIndex === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </button>
        )}
      </div>
    </section>
  );
}

export default Quiz;