import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      title="Toggle Theme"
    >
      {darkMode ? (
        <i className="fi fi-rr-moon text-yellow-400 text-xl"></i>
      ) : (
        <i className="fi fi-rr-sun text-orange-500 text-xl"></i>
      )}
    </button>
  );
};

export default ThemeToggle;
