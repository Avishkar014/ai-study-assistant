import { useState } from "react";

function PromptInput() {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    console.log("Study request:", input);
  };

  return (
    <form className="prompt-card" onSubmit={handleSubmit}>
      <label htmlFor="study-input">
        What do you want to study?
      </label>

      <textarea
        id="study-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Example: React hooks, closures in JavaScript, DBMS normalization..."
        rows={6}
      />

      <div className="prompt-footer">
        <span>{input.length}/5000</span>

        <button
          type="submit"
          disabled={!input.trim()}
        >
          Generate Study Kit
        </button>
      </div>
    </form>
  );
}

export default PromptInput;