function LoadingState({ progressLabel, progressValue }) {
  const showProgress = typeof progressValue === "number";

  return (
    <section className="state-card loading-state" aria-live="polite">
      <div className="spinner" />

      <h3>Building your study kit...</h3>

      <p>
        {progressLabel ||
          "The AI is analyzing your content and creating questions for you."}
      </p>

      {showProgress && (
        <div
          className="loading-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressValue * 100)}
        >
          <div
            className="loading-progress-fill"
            style={{ width: `${Math.round(progressValue * 100)}%` }}
          />
        </div>
      )}
    </section>
  );
}

export default LoadingState;
