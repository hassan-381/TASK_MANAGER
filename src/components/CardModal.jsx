import { useState } from "react";

export default function CardModal({
  card,
  onClose,
  onSave,
  onDelete,
  darkMode,
}) {
  const [editedCard, setEditedCard] = useState({ ...card });
  const [newLabel, setNewLabel] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCard({ ...editedCard, [name]: value });
  };

  const handleLabelAdd = () => {
    if (newLabel.trim() && !editedCard.labels.includes(newLabel)) {
      setEditedCard({
        ...editedCard,
        labels: [...editedCard.labels, newLabel],
      });
      setNewLabel("");
    }
  };

  const handleLabelRemove = (labelToRemove) => {
    setEditedCard({
      ...editedCard,
      labels: editedCard.labels.filter((label) => label !== labelToRemove),
    });
  };

  const handleAssigneeAdd = () => {
    if (newAssignee.trim() && !editedCard.assignedTo.includes(newAssignee)) {
      setEditedCard({
        ...editedCard,
        assignedTo: [...editedCard.assignedTo, newAssignee],
      });
      setNewAssignee("");
    }
  };

  const handleAssigneeRemove = (assigneeToRemove) => {
    setEditedCard({
      ...editedCard,
      assignedTo: editedCard.assignedTo.filter(
        (assignee) => assignee !== assigneeToRemove
      ),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-lg p-6 w-full max-w-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Card</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-400">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={editedCard.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={editedCard.description}
              onChange={handleChange}
              rows="3"
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={editedCard.dueDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Due Time
              </label>
              <input
                type="time"
                name="dueTime"
                value={editedCard.dueTime}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Priority
            </label>
            <select
              name="priority"
              value={editedCard.priority}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Labels
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Add label"
                className={`flex-1 p-2 border rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
              <button
                onClick={handleLabelAdd}
                className="px-3 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedCard.labels.map((label) => (
                <span
                  key={label}
                  className={`flex items-center text-xs px-2 py-1 rounded ${
                    label === "bug"
                      ? darkMode
                        ? "bg-red-800"
                        : "bg-red-200"
                      : label === "feature"
                      ? darkMode
                        ? "bg-blue-800"
                        : "bg-blue-200"
                      : label === "enhancement"
                      ? darkMode
                        ? "bg-purple-800"
                        : "bg-purple-200"
                      : darkMode
                      ? "bg-yellow-800"
                      : "bg-yellow-200"
                  }`}
                >
                  {label}
                  <button
                    onClick={() => handleLabelRemove(label)}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editedCard)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
