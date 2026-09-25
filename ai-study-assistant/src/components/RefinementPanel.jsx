import { useState } from "react";

const INSTRUCTION_EXAMPLES = [
  "Make the questions harder",
  "Add more beginner-friendly explanations",
  "Focus on interview questions",
  "Simplify the flashcards",
  "Add more practice questions",
];

function RefinementPanel({ onRefine, refining, error }) {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = instruction.trim();

    if (!value || refining) {
      return;
    }

    const refined = await onRefine(value);

    if (refined) {
      setInstruction("");
    }
  };

  return (
    <section className="refine-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">REFINE</p>

          <h2>Want to improve this study kit?</h2>
        </div>

        {refining && <span className="refine-status">Updating your kit...</span>}
      </div>

      <form className="refine-card" onSubmit={handleSubmit}>
        <label htmlFor="refine-instruction">
          Tell the AI how to adjust this study kit
        </label>

        <textarea
          id="refine-instruction"
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          placeholder="Example: Make the questions harder"
          rows={3}
          maxLength={400}
          disabled={refining}
        />

        <div className="refine-examples">
          {INSTRUCTION_EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="refine-chip"
              onClick={() => setInstruction(example)}
              disabled={refining}
            >
              {example}
            </button>
          ))}
        </div>

        {error && (
          <p className="refine-error" role="alert">
            {error}
          </p>
        )}

        <div className="refine-footer">
          <span>{instruction.length}/400</span>

          <button type="submit" disabled={!instruction.trim() || refining}>
            {refining ? "Refining..." : "Refine Study Kit"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default RefinementPanel;
