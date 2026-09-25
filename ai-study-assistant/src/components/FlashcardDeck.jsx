import { useState } from "react";
import Flashcard from "./Flashcard";

function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!cards || cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];

  const goPrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const goNext = () => {
    setCurrentIndex((index) =>
      Math.min(index + 1, cards.length - 1)
    );
  };

  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <section className="flashcard-section">
      <div className="flashcard-section-header">
        <div>
          <span className="flashcard-section-label">
            FLASHCARDS
          </span>

          <h2>Review what you learned</h2>
        </div>

        <span className="flashcard-progress">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="flashcard-progress-bar">
        <div
          className="flashcard-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Flashcard card={currentCard} />

      <div className="flashcard-controls">
        <button
          className="flashcard-button"
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <span className="flashcard-counter">
          Card {currentIndex + 1} of {cards.length}
        </span>

        <button
          className="flashcard-button primary"
          onClick={goNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next →
        </button>
      </div>
    </section>
  );
}

export default FlashcardDeck;