function Header({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-icon">S</div>

          <div>
            <h2>StudyAI</h2>
            <span>Study smarter</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-badge">AI Study Assistant</div>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-pressed={isDark}
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {isDark ? "☀" : "☾"}
            </span>

            <span className="theme-toggle-label">
              {isDark ? "Light" : "Dark"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
