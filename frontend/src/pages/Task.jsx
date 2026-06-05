import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const itemsPerPage = 5;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/task");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await api.post("/task", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/task/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      await api.patch(`/task/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (task) => {
    setEditTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateTask = async () => {
    if (!editTask?.title?.trim()) return;

    try {
      await api.put(`/task/${editTask._id}`, {
        title: editTask.title,
        description: editTask.description,
      });

      setEditTask(null);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    setEditTask(null);
  };

  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "pending") return task.status === "pending";
      if (filter === "completed") return task.status === "completed";
      return true;
    });
  }, [tasks, filter]);

  const currentTasks = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredTasks.slice(indexOfFirst, indexOfLast);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;

    return {
      total: tasks.length,
      completed,
      pending,
    };
  }, [tasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Task Dashboard
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">Manage your tasks efficiently</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
              <div className="flex gap-2 sm:gap-3 justify-center w-full sm:w-auto">
                <div className="text-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-lg sm:rounded-xl">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-xs text-blue-600">Total</p>
                </div>
                <div className="text-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-orange-50 rounded-lg sm:rounded-xl">
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.pending}</p>
                  <p className="text-xs text-orange-600">Pending</p>
                </div>
                <div className="text-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-green-50 rounded-lg sm:rounded-xl">
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 sm:px-5 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg sm:rounded-xl font-medium transition transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {editTask && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3 sm:px-4" onClick={cancelEdit}>
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl mx-3 sm:mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">✏️ Edit Task</h2>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              
              <input
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                placeholder="Task title"
                className="w-full mb-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                autoFocus
              />

              <textarea
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                placeholder="Task description"
                rows="3"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-300 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTask}
                  className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-base sm:text-lg">+</span>
                </div>
                <h2 className="text-base sm:text-lg font-semibold">Add New Task</h2>
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full mb-3 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                rows="3"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none text-sm sm:text-base"
              />

              <button
                onClick={addTask}
                className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-green-600 transition transform hover:scale-[1.02] font-medium text-sm sm:text-base"
              >
                Create Task
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-base sm:text-lg">📋</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold">All Tasks</h2>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setFilter("all")}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                        filter === "all"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("pending")}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                        filter === "pending"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilter("completed")}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                        filter === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-gray-500 mt-3 text-sm sm:text-base">Loading tasks...</p>
                  </div>
                ) : currentTasks.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">✨</div>
                    <p className="text-gray-400 text-base sm:text-lg">No tasks found</p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      {filter !== "all" ? "Try changing the filter" : "Add your first task to get started"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {currentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="group bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                              <input
                                type="checkbox"
                                checked={task.status === "completed"}
                                onChange={() => toggleTask(task._id)}
                                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                              />
                              <h3 className={`font-semibold text-gray-900 text-sm sm:text-base ${
                                task.status === "completed" ? "line-through text-gray-400" : ""
                              }`}>
                                {task.title}
                              </h3>
                              <span
                                className={`text-xs px-2 py-0.5 sm:py-1 rounded-full ${
                                  task.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>
                            
                            {task.description && (
                              <p className="text-xs sm:text-sm text-gray-500 ml-6 sm:ml-8 mb-2 break-words">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 ml-6 sm:ml-0">
                            <button
                              onClick={() => startEdit(task)}
                              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm sm:text-base"
                              title="Edit task"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm sm:text-base"
                              title="Delete task"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredTasks.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-6 pt-4 border-t border-gray-100">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm sm:text-base"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full px-2 py-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition text-xs sm:text-sm flex items-center justify-center ${
                            currentPage === i + 1
                              ? "bg-gray-900 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm sm:text-base"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}