function formatSessionDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Saved earlier";
  }

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SessionList({ sessions, activeId, onSelect, onDelete }) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <section className="session-section" aria-label="Recent study sessions">
      <div className="section-heading">
        <div>
          <p className="eyebrow">RECENT SESSIONS</p>

          <h2>Pick up where you left off</h2>
        </div>

        <span>{sessions.length} saved</span>
      </div>

      <ul className="session-list">
        {sessions.map((session) => {
          const isActive = session.id === activeId;

          return (
            <li
              key={session.id}
              className={isActive ? "session-item active" : "session-item"}
            >
              <button
                type="button"
                className="session-open"
                onClick={() => onSelect(session)}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="session-title">{session.title}</span>

                <span className="session-meta">
                  {formatSessionDate(session.createdAt)} ·{" "}
                  {session.studyKit.blocks.length} blocks
                </span>
              </button>

              <button
                type="button"
                className="session-delete"
                onClick={() => onDelete(session.id)}
                aria-label={`Delete session ${session.title}`}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default SessionList;
