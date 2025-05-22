import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartScreen from "./components/StartScreen";
import BoardView from "./components/BoardView";
import BoardScreen from "./components/BoardScreen";

export const ThemeContext = createContext();
export const UserContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [boards, setBoards] = useState(() => {
    try {
      const savedBoards = localStorage.getItem("boards");
      return savedBoards ? JSON.parse(savedBoards) : [];
    } catch (error) {
      localStorage.removeItem("boards");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!user) return;
    const minimalUser = {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
    try {
      localStorage.setItem("user", JSON.stringify(minimalUser));
    } catch (error) {
      console.warn("User data too large to save:", error);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("boards", JSON.stringify(boards));
    } catch (error) {
      console.warn("Boards data too large to save:", error);
    }
  }, [boards]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <div
          className={`min-h-screen ${
            darkMode ? "dark bg-gray-900" : "bg-gray-50"
          }`}
        >
          <Router>
            <Routes>
              <Route path="/" element={<StartScreen />} />
              <Route
                path="/boards"
                element={<BoardView boards={boards} setBoards={setBoards} />}
              />
              <Route
                path="/board/:boardId"
                element={<BoardScreen boards={boards} setBoards={setBoards} />}
              />
            </Routes>
          </Router>
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
