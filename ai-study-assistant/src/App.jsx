import "./App.css";
import { useState } from "react";
import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import SessionList from "./components/SessionList";
import RefinementPanel from "./components/RefinementPanel";
import StudyBlockRenderer from "./components/blocks/StudyBlockRenderer";
import {
  generateStudyKit,
  generateStudyKitStream,
  refineStudyKit,
} from "./services/api";
import {
  createSession,
  deleteSession,
  getSessions,
  saveSession,
  updateSession,
} from "./services/sessionStorage";
import { applyTheme, getInitialTheme, saveTheme } from "./services/theme";

const EXPECTED_BLOCKS = 10;
const EXPECTED_CHARACTERS = 4800;

function App() {
  const [studyKit, setStudyKit] = useState(null);
  const [kitVersion, setKitVersion] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [sessions, setSessions] = useState(() => getSessions());
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState(null);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [error, setError] = useState("");
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState("");
  const [theme, setTheme] = useState(getInitialTheme);

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    saveTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const requestStudyKit = async (input) => {
    if (!streamingEnabled) {
      return generateStudyKit(input);
    }

    try {
      return await generateStudyKitStream(input, setStreamProgress);
    } catch (streamError) {
      if (!streamError?.canFallback) {
        throw streamError;
      }

      console.error(
        "Streaming generation failed, retrying without streaming:",
        streamError
      );

      setStreamProgress(null);

      return generateStudyKit(input);
    }
  };

  const handleGenerate = async (input) => {
    setLoading(true);
    setStreaming(streamingEnabled);
    setError("");
    setRefineError("");
    setStreamProgress(null);
    setCurrentInput(input);

    try {
      const data = await requestStudyKit(input);
      const session = createSession(data, input);

      saveSession(session);

      setSessions(getSessions());
      setActiveSessionId(session.id);
      setStudyKit(data);
      setKitVersion((version) => version + 1);
    } catch (requestError) {
      console.error("Study kit error:", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate the study kit."
      );
    } finally {
      setLoading(false);
      setStreaming(false);
      setStreamProgress(null);
    }
  };

  const handleRefine = async (instruction) => {
    setRefining(true);
    setRefineError("");

    try {
      const data = await refineStudyKit(studyKit, instruction);

      setStudyKit(data);
      setKitVersion((version) => version + 1);

      if (activeSessionId) {
        updateSession(activeSessionId, data);
      } else {
        const session = createSession(data, currentInput);

        saveSession(session);
        setActiveSessionId(session.id);
      }

      setSessions(getSessions());

      return true;
    } catch (refineRequestError) {
      console.error("Refinement error:", refineRequestError);

      setRefineError(
        refineRequestError instanceof Error
          ? refineRequestError.message
          : "Unable to refine the study kit."
      );

      return false;
    } finally {
      setRefining(false);
    }
  };

  const handleSelectSession = (session) => {
    setStudyKit(session.studyKit);
    setKitVersion((version) => version + 1);
    setCurrentInput(session.originalInput);
    setActiveSessionId(session.id);
    setError("");
    setRefineError("");
  };

  const handleDeleteSession = (id) => {
    deleteSession(id);
    setSessions(getSessions());

    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

  const progressLabel =
    streaming && streamProgress
      ? `${streamProgress.blocks} of ${EXPECTED_BLOCKS} blocks received`
      : "";

  const progressValue =
    streaming && streamProgress
      ? Math.min(
          0.94,
          Math.max(
            streamProgress.blocks / EXPECTED_BLOCKS,
            streamProgress.characters / EXPECTED_CHARACTERS
          )
        )
      : null;

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      <main className="main-content">
        <section className="hero-section">
          <p className="eyebrow">AI-POWERED LEARNING</p>

          <h1>Turn your notes into a study kit.</h1>

          <p className="hero-description">
            Paste your notes or enter a topic. The AI will build flashcards,
            quiz questions, a checklist and a chart you can practise
            interactively.
          </p>
        </section>

        <PromptInput
          key={activeSessionId || "new-session"}
          initialValue={currentInput}
          onGenerate={handleGenerate}
          loading={loading}
          streaming={streamingEnabled}
          onToggleStreaming={() =>
            setStreamingEnabled((current) => !current)
          }
        />

        <SessionList
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={handleSelectSession}
          onDelete={handleDeleteSession}
        />

        {loading && (
          <LoadingState
            progressLabel={progressLabel}
            progressValue={progressValue}
          />
        )}

        {!loading && error && (
          <ErrorState
            message={error}
            onRetry={currentInput ? () => handleGenerate(currentInput) : null}
          />
        )}

        {!loading && !error && !studyKit && <EmptyState />}

        {!loading && !error && studyKit && (
          <>
            <section className="study-kit-header">
              <p className="eyebrow">STUDY KIT</p>

              <h2>{studyKit.title}</h2>

              <p className="study-kit-meta">
                {studyKit.blocks.length} blocks
                {activeSessionId
                  ? " · saved to your recent sessions"
                  : " · not saved yet"}
              </p>
            </section>

            <StudyBlockRenderer key={kitVersion} blocks={studyKit.blocks} />

            <RefinementPanel
              onRefine={handleRefine}
              refining={refining}
              error={refineError}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
