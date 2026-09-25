import { useState } from "react";

function ChecklistBlock({ data }) {
  const [completedItems, setCompletedItems] = useState([]);

  const title = typeof data?.title === "string" ? data.title : "Checklist";

  const items = Array.isArray(data?.items)
    ? data.items.filter((item) => typeof item === "string" && item.trim())
    : [];

  if (items.length === 0) {
    return null;
  }

  const completedCount = completedItems.filter((index) => items[index]).length;
  const progress = Math.round((completedCount / items.length) * 100);

  const toggleItem = (index) => {
    setCompletedItems((current) =>
      current.includes(index)
        ? current.filter((value) => value !== index)
        : [...current, index]
    );
  };

  return (
    <section className="study-block checklist-block">
      <header className="study-block-header">
        <p className="eyebrow">CHECKLIST</p>

        <h2>{title}</h2>

        <p className="checklist-progress-text" aria-live="polite">
          {completedCount} / {items.length} completed
        </p>
      </header>

      <div
        className="checklist-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={completedCount}
        aria-label={`${title} progress`}
      >
        <div
          className="checklist-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="checklist-items">
        {items.map((item, index) => {
          const isCompleted = completedItems.includes(index);

          return (
            <li
              key={`${index}-${item}`}
              className={isCompleted ? "checklist-item done" : "checklist-item"}
            >
              <label>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleItem(index)}
                />

                <span className="checklist-text">{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ChecklistBlock;

