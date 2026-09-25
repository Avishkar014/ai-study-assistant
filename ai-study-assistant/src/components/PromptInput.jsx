import { useState } from "react";

function PromptInput({
  onGenerate,
  loading,
  initialValue = "",
  streaming,
  onToggleStreaming,
}) {
  const [input, setInput] = useState(initialValue);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = input.trim();

    if (!value || loading) {
      return;
    }

    await onGenerate(value);
  };

  return (
    <form className="prompt-card" onSubmit={handleSubmit}>
      <label htmlFor="study-input">What do you want to study?</label>

      <textarea
        id="study-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Example: React hooks, closures in JavaScript, DBMS normalization..."
        rows={6}
        maxLength={5000}
        disabled={loading}
      />

      <div className="prompt-footer">
        <label className="stream-toggle">
          <input
            type="checkbox"
            checked={streaming}
            onChange={onToggleStreaming}
            disabled={loading}
          />

          <span>Live progress</span>
        </label>

        <span className="prompt-counter">{input.length}/5000</span>

        <button type="submit" disabled={!input.trim() || loading}>
          {loading ? "Generating..." : "Generate Study Kit"}
        </button>
      </div>
    </form>
  );
}

export default PromptInput;
