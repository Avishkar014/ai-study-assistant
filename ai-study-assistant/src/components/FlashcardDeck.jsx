import { useState } from "react";
import Flashcard from "./Flashcard";

function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];
  const total = cards.length;

  const goTo = (index) => {
    const nextIndex = Math.min(Math.max(index, 0), total - 1);

    if (nextIndex === currentIndex) {
      return;
    }

    setCurrentIndex(nextIndex);
    setFlipped(false);
  };

  const toggleFlip = () => {
    setFlipped((current) => !current);
  };

  const handleKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
      return;
    }

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      toggleFlip();
    }
  };

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <section
      className="flashcard-section"
      role="group"
      tabIndex={0}
      aria-label={`Flashcard deck, card ${currentIndex + 1} of ${total}`}
      onKeyDown={handleKeyDown}
    >
      <div className="flashcard-section-header">
        <div>
          <span className="flashcard-section-label">FLASHCARDS</span>

          <h2>Review what you learned</h2>
        </div>

        <span className="flashcard-progress">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div className="flashcard-progress-bar">
        <div
          className="flashcard-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Flashcard card={currentCard} flipped={flipped} onToggle={toggleFlip} />

      <div className="flashcard-controls">
        <button
          type="button"
          className="flashcard-button"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <span className="flashcard-counter">
          Card {currentIndex + 1} of {total}
        </span>

        <button
          type="button"
          className="flashcard-button primary"
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === total - 1}
        >
          Next →
        </button>
      </div>

      <p className="flashcard-keyboard-hint">
        Use ← and → to move between cards and Space to flip the current card.
      </p>
    </section>
  );
}

export default FlashcardDeck;
