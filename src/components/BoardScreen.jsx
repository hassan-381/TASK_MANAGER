import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ThemeContext } from "../App";
import { v4 as uuidv4 } from "uuid";
import CardModal from "./CardModal";
import { ArrowLeft, LogOut, Pencil, Sun, SunMoon, Trash2 } from "lucide-react";

export default function BoardScreen({ boards, setBoards }) {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [newListName, setNewListName] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLabel, setFilterLabel] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [isCreatingNewCard, setIsCreatingNewCard] = useState(false);
  const [newCardListId, setNewCardListId] = useState(null);

  const board = boards.find((b) => b.id === boardId);

  useEffect(() => {
    if (!board) navigate("/boards");
  }, [board, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  if (!board) return null;

  const addList = () => {
    if (!newListName.trim()) return;

    const updatedBoards = boards.map((b) => {
      if (b.id === boardId) {
        return {
          ...b,
          lists: [
            ...(b.lists || []),
            {
              id: uuidv4(),
              name: newListName,
              cards: [],
            },
          ],
        };
      }
      return b;
    });

    setBoards(updatedBoards);
    setNewListName("");
    setShowListModal(false);
  };

  const startEditList = (listId, currentName) => {
    setEditingListId(listId);
    setEditingListName(currentName);
  };

  const saveListEdit = (listId) => {
    if (!editingListName.trim()) return;

    const updatedBoards = boards.map((b) => {
      if (b.id === boardId) {
        return {
          ...b,
          lists: b.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                name: editingListName,
              };
            }
            return list;
          }),
        };
      }
      return b;
    });

    setBoards(updatedBoards);
    setEditingListId(null);
    setEditingListName("");
  };

  const deleteList = (listId) => {
    const updatedBoards = boards.map((b) => {
      if (b.id === boardId) {
        return {
          ...b,
          lists: b.lists.filter((list) => list.id !== listId),
        };
      }
      return b;
    });

    setBoards(updatedBoards);
  };

  const startCreatingCard = (listId) => {
    setNewCardListId(listId);
    setIsCreatingNewCard(true);
    setSelectedCard({
      id: uuidv4(),
      title: "",
      description: "",
      labels: [],
      dueDate: "",
      dueTime: "",
      assignedTo: [],
      priority: "medium",
      listId: listId,
    });
  };

  const handleSaveCard = (updatedCard) => {
    if (isCreatingNewCard) {
      // Add new card
      const updatedBoards = boards.map((b) => {
        if (b.id === boardId) {
          return {
            ...b,
            lists: b.lists.map((list) => {
              if (list.id === newCardListId) {
                return {
                  ...list,
                  cards: [...list.cards, updatedCard],
                };
              }
              return list;
            }),
          };
        }
        return b;
      });
      setBoards(updatedBoards);
      setIsCreatingNewCard(false);
    } else {
      // Update existing card
      updateCard(selectedCard.listId, selectedCard.id, updatedCard);
    }
    setSelectedCard(null);
  };

  const updateCard = (listId, cardId, updatedCard) => {
    const updatedBoards = boards.map((b) => {
      if (b.id === boardId) {
        return {
          ...b,
          lists: b.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                cards: list.cards.map((card) =>
                  card.id === cardId ? { ...card, ...updatedCard } : card
                ),
              };
            }
            return list;
          }),
        };
      }
      return b;
    });

    setBoards(updatedBoards);
  };

  const deleteCard = (listId, cardId) => {
    const updatedBoards = boards.map((b) => {
      if (b.id === boardId) {
        return {
          ...b,
          lists: b.lists.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                cards: list.cards.filter((card) => card.id !== cardId),
              };
            }
            return list;
          }),
        };
      }
      return b;
    });

    setBoards(updatedBoards);
    setSelectedCard(null);
  };

  const onDragEnd = (result) => {
    const { destination, source, type } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "list") {
      const newLists = Array.from(board.lists);
      const [moved] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, moved);

      const updatedBoards = boards.map((b) =>
        b.id === boardId ? { ...b, lists: newLists } : b
      );

      setBoards(updatedBoards);
      return;
    }

    const startList = board.lists.find(
      (list) => list.id === source.droppableId
    );
    const endList = board.lists.find(
      (list) => list.id === destination.droppableId
    );

    if (!startList || !endList) return;

    const startCards = Array.from(startList.cards);
    const [movedCard] = startCards.splice(source.index, 1);

    if (startList === endList) {
      startCards.splice(destination.index, 0, movedCard);
      const updatedBoards = boards.map((b) =>
        b.id === boardId
          ? {
              ...b,
              lists: b.lists.map((list) =>
                list.id === startList.id ? { ...list, cards: startCards } : list
              ),
            }
          : b
      );
      setBoards(updatedBoards);
    } else {
      const endCards = Array.from(endList.cards);
      endCards.splice(destination.index, 0, movedCard);
      const updatedBoards = boards.map((b) =>
        b.id === boardId
          ? {
              ...b,
              lists: b.lists.map((list) => {
                if (list.id === startList.id)
                  return { ...list, cards: startCards };
                if (list.id === endList.id) return { ...list, cards: endCards };
                return list;
              }),
            }
          : b
      );
      setBoards(updatedBoards);
    }
  };

  const filteredLists = board.lists.map((list) => {
    let filteredCards = list.cards;

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();

      filteredCards = filteredCards.filter((card) => {
        const titleMatch = card.title?.toLowerCase().includes(lowerSearch);
        const descMatch = card.description?.toLowerCase().includes(lowerSearch);
        const labelMatch = Array.isArray(card.labels)
          ? card.labels.some((label) =>
              label.toLowerCase().includes(lowerSearch)
            )
          : card.label?.toLowerCase().includes(lowerSearch);

        return titleMatch || descMatch || labelMatch;
      });
    }

    if (filterLabel) {
      filteredCards = filteredCards.filter((card) =>
        Array.isArray(card.labels)
          ? card.labels.includes(filterLabel)
          : card.label === filterLabel
      );
    }

    if (filterDueDate) {
      filteredCards = filteredCards.filter(
        (card) => card.dueDate === filterDueDate
      );
    }

    return { ...list, cards: filteredCards };
  });

  return (
    <div
      className={`p-4 min-h-screen text-white dark:bg-gradient-to-b from-[#0b004e] via-[#1d152f] to-[#002834] ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/boards"
            className="border-2 rounded-full p-2 items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {board.name}
          </h1>
        </div>
        <div className="flex space-x-4">
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

      <div className="mb-6 justify-between flex flex-wrap gap-4 border-0 lg:border-2  md:border-2 sm:border-2 py-3 px-4 border-gray-600 rounded-full dark:border-white">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-96 lg:w-96 md:w-60 sm:w-full  border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={filterLabel}
            onChange={(e) => setFilterLabel(e.target.value)}
            className="p-2 border rounded text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Filter by label</option>
          </select>
          <input
            type="date"
            value={filterDueDate}
            onChange={(e) => setFilterDueDate(e.target.value)}
            className="p-2 border rounded text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          onClick={() => setShowListModal(true)}
          className="p-2 px-4 w-full lg:w-36 md:w-32 sm:w-32 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 whitespace-nowrap"
        >
          Add New List
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-2  flex-wrap pb-4 gap-2"
            >
              {filteredLists.map((list, listIndex) => (
                <Draggable
                  key={list.id}
                  draggableId={list.id}
                  index={listIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex-shrink-0 flex-wrap w-full rounded-lg p-4  ${
                        darkMode ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        {editingListId === list.id ? (
                          <input
                            type="text"
                            value={editingListName}
                            onChange={(e) => setEditingListName(e.target.value)}
                            onBlur={() => saveListEdit(list.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveListEdit(list.id);
                            }}
                            autoFocus
                            className="font-semibold bg-transparent border-b border-gray-400 focus:outline-none focus:border-indigo-500 dark:text-white"
                          />
                        ) : (
                          <h3
                            {...provided.dragHandleProps}
                            className="font-semibold text-gray-900 dark:text-white cursor-grab"
                          >
                            {list.name}
                          </h3>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditList(list.id, list.name)}
                            className="text-gray-400 hover:text-blue-500"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteList(list.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <Droppable droppableId={list.id} type="card">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="h-auto shadow-md rounded-md"
                          >
                            {list.cards.map((card, cardIndex) => (
                              <Draggable
                                key={card.id}
                                draggableId={card.id}
                                index={cardIndex}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => {
                                      setIsCreatingNewCard(false);
                                      setSelectedCard({
                                        ...card,
                                        listId: list.id,
                                      });
                                    }}
                                    className={`mb-2 p-3 text-black rounded shadow cursor-pointer hover:shadow-md transition-shadow ${
                                      darkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-white"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <h4 className="font-medium">
                                        {card.title}
                                      </h4>
                                      {card.priority && (
                                        <span
                                          className={`text-xs px-2 py-1 rounded ${
                                            card.priority === "high"
                                              ? darkMode
                                                ? "bg-red-900 text-red-200"
                                                : "bg-red-100 text-red-800"
                                              : card.priority === "low"
                                              ? darkMode
                                                ? "bg-green-900 text-green-200"
                                                : "bg-green-100 text-green-800"
                                              : darkMode
                                              ? "bg-yellow-900 text-yellow-200"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {card.priority}
                                        </span>
                                      )}
                                    </div>
                                    {card.description && (
                                      <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                                        {card.description}
                                      </p>
                                    )}
                                    {(card.dueDate || card.dueTime) && (
                                      <div className="flex items-center gap-1 mt-2 text-xs">
                                        <span className="text-gray-500 dark:text-gray-400">
                                          Due:
                                        </span>
                                        {card.dueDate && (
                                          <span
                                            className={`px-2 py-1 rounded ${
                                              new Date(card.dueDate) <
                                              new Date()
                                                ? darkMode
                                                  ? "bg-red-900 text-red-200"
                                                  : "bg-red-100 text-red-800"
                                                : darkMode
                                                ? "bg-green-900 text-green-200"
                                                : "bg-green-100 text-green-800"
                                            }`}
                                          >
                                            {new Date(
                                              card.dueDate
                                            ).toLocaleDateString()}
                                          </span>
                                        )}
                                        {card.dueTime && (
                                          <span
                                            className={`px-2 py-1 rounded ${
                                              darkMode
                                                ? "bg-blue-900 text-blue-200"
                                                : "bg-blue-100 text-blue-800"
                                            }`}
                                          >
                                            {card.dueTime}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                    {card.labels.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {card.labels.map((label) => (
                                          <span
                                            key={label}
                                            className={`text-xs px-2 py-1 rounded ${
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
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      <button
                        onClick={() => startCreatingCard(list.id)}
                        className={`w-full mt-2 p-2 text-sm rounded border-2 shadow-md ease-in-out duration-300 ${
                          darkMode
                            ? "text-gray-300 hover:text-white hover:bg-gray-600"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        + Add a card
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-lg p-6 w-full max-w-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Add New List
            </h2>
            <input
              type="text"
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addList();
              }}
              className={`w-full p-2 border rounded mb-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              }`}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowListModal(false)}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={addList}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add List
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onSave={handleSaveCard}
          onDelete={() => {
            if (!isCreatingNewCard) {
              deleteCard(selectedCard.listId, selectedCard.id);
            }
            setSelectedCard(null);
          }}
          darkMode={darkMode}
          isNewCard={isCreatingNewCard}
        />
      )}
    </div>
  );
}
