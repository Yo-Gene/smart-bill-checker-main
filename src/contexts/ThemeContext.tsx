import { createContext, useState, ReactNode, useEffect } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("app_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDarkMode(parsed.darkMode);
    }
  }, []);

  // Apply 'dark' class to <html> globally
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};