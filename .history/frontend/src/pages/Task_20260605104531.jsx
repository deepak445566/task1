import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const itemsPerPage = 5;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/task");
      setTasks(res.data.tasks);
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
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await api.delete(`/task/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTask = async (id) => {
    try {
      await api.patch(`/task/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateTask = async () => {
    if (!editTitle.trim()) return;

    try {
      await api.put(`/task/${editId}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditId(null);
      setEditTitle("");
      setEditDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Task Dashboard
              </h1>
              <p className="text-gray-500 mt-2">Manage your tasks efficiently</p>
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
                  <p className="text-xs text-blue-600">Total</p>
                </div>
                <div className="text-center px-4 py-2 bg-orange-50 rounded-xl">
                  <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
                  <p className="text-xs text-orange-600">Pending</p>
                </div>
                <div className="text-center px-4 py-2 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                  <p className="text-xs text-green-600">Completed</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="ml-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition transform hover:scale-105 flex items-center gap-2"
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
        {editId && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 px-4" onClick={cancelEdit}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">✏️ Edit Task</h2>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
                className="w-full mb-3 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Task description"
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTask}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">+</span>
                </div>
                <h2 className="text-lg font-semibold">Add New Task</h2>
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full mb-3 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
              />

              <button
                onClick={addTask}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-600 transition transform hover:scale-[1.02] font-medium"
              >
                Create Task
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-lg">📋</span>
                    </div>
                    <h2 className="text-lg font-semibold">All Tasks</h2>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        filter === "all"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter("pending")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        filter === "pending"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setFilter("completed")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-gray-500 mt-3">Loading tasks...</p>
                  </div>
                ) : currentTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-gray-400 text-lg">No tasks found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {filter !== "all" ? "Try changing the filter" : "Add your first task to get started"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentTasks.map((task, index) => (
                      <div
                        key={task._id}
                        className="group bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
                        style={{ animationDelay: `${index * 50}ms`, animation: 'fadeInUp 0.3s ease-out' }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                checked={task.status === "completed"}
                                onChange={() => toggleTask(task._id)}
                                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                              />
                              <h3 className={`font-semibold text-gray-900 ${
                                task.status === "completed" ? "line-through text-gray-400" : ""
                              }`}>
                                {task.title}
                              </h3>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  task.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>
                            
                            {task.description && (
                              <p className="text-sm text-gray-500 ml-8 mb-2">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit(task)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit task"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 rounded-lg transition ${
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
                      className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}