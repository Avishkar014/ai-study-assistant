import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import FlashcardDeck from "./components/FlashcardDeck";
import Quiz from "./components/Quiz";
import { generateStudyKit } from "./services/api";

function App() {
  const [studyKit, setStudyKit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (input) => {
    setLoading(true);
    setError("");
    setStudyKit(null);

    try {
      const data = await generateStudyKit(input);

      if (
        !data ||
        !Array.isArray(data.cards) ||
        !Array.isArray(data.quiz)
      ) {
        throw new Error("Invalid study kit received from server.");
      }

      setStudyKit(data);
    } catch (err) {
      console.error("Study kit error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate the study kit."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <section className="hero-section">
          <p className="eyebrow">AI-POWERED LEARNING</p>

          <h1>Turn your notes into a study kit.</h1>

          <p className="hero-description">
            Paste your notes or enter a topic. The AI will create flashcards
            and quiz questions you can practice interactively.
          </p>
        </section>

        <PromptInput
          onGenerate={handleGenerate}
          loading={loading}
        />

        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && !studyKit && <EmptyState />}

        {!loading && !error && studyKit && (
          <>
            <FlashcardDeck cards={studyKit.cards} />

            <Quiz questions={studyKit.quiz} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;