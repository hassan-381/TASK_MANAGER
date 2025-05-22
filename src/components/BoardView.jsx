import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { v4 as uuidv4 } from "uuid";
import { LogOut, Sun, SunMoon, Trash2 } from "lucide-react";

export default function BoardView({ boards, setBoards }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [newBoardName, setNewBoardName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const createBoard = () => {
    if (!newBoardName.trim()) return;

    const newBoard = {
      id: uuidv4(),
      name: newBoardName,
      lists: [],
    };

    setBoards([...boards, newBoard]);
    setNewBoardName("");
    setShowModal(false);
    navigate(`/board/${newBoard.id}`);
  };

  const deleteBoard = (boardId) => {
    setBoards(boards.filter((board) => board.id !== boardId));
  };

  return (
    <div className="p-4 min-h-screen  text-white dark:bg-gradient-to-b from-[#0b004e] via-[#1d152f] to-[#002834] ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Your Boards
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create New Board
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? (
              <Sun color={darkMode ? "white" : "black"} />
            ) : (
              <SunMoon color={darkMode ? "white" : "black"} />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
            title="Logout"
          >
            <LogOut color={darkMode ? "white" : "black"} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <div key={board.id} className="relative group">
            <Link
              to={`/board/${board.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 dark:bg-gray-700"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {board.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-300">
                {board.lists?.length || 0} lists
              </p>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                deleteBoard(board.id);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Create New Board
            </h2>
            <input
              type="text"
              placeholder="Board name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={createBoard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
