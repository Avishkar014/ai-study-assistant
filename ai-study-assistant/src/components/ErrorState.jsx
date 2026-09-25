function ErrorState({ message, onRetry }) {
  return (
    <section className="state-card error-state">
      <div className="error-icon">!</div>

      <h3>We couldn't generate your study kit</h3>

      <p>
        {message || "Something went wrong. Please try again."}
      </p>

      {onRetry && (
        <button onClick={onRetry}>
          Try Again
        </button>
      )}
    </section>
  );
}

export default ErrorState;