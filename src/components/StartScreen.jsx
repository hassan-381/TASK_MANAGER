import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function StartScreen() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/boards");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name, avatar });
    navigate("/boards");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="app flex flex-col items-center justify-center min-h-screen p-4  text-white dark:bg-gradient-to-b from-[#0b004e] via-[#1d152f] to-[#002834]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Manager
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Organize your work efficiently
          </p>
          <img
            className="mt-4 w-32 bg-white rounded-full shadow-lg"
            src="/../public/WhatsApp_Image_2025-01-15_at_13.02.56_6e12d1bd-removebg-preview.png"
            alt=""
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Avatar (Optional)
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full px-3 py-2 mt-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
            {avatar && (
              <div className="mt-2">
                <img
                  src={avatar}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
