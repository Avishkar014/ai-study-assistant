const THEME_KEY = "ai-study-assistant-theme";
const THEMES = ["light", "dark"];

export function getInitialTheme() {
  let stored = null;

  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch (error) {
    console.error("Unable to read the saved theme:", error);
  }

  if (THEMES.includes(stored)) {
    return stored;
  }

  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function applyTheme(theme) {
  const value = THEMES.includes(theme) ? theme : "light";

  document.documentElement.dataset.theme = value;
  document.documentElement.style.colorScheme = value;
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);

    return true;
  } catch (error) {
    console.error("Unable to save the theme:", error);

    return false;
  }
}
