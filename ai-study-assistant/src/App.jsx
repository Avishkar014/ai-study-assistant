import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import EmptyState from "./components/EmptyState";

function App() {
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

        <PromptInput />

        <EmptyState />
      </main>
    </div>
  );
}

export default App;