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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Task Dashboard
              </h1>
              <p className="text-gray-500 mt-1">Organize your work efficiently</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <p className="text-gray-500 text-sm">Pending Tasks</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Completed Tasks</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {editTask ? "✏️ Edit Task" : "➕ Add New Task"}
          </h2>
          
          <input
            value={editTask ? editTask.title : title}
            onChange={(e) =>
              editTask
                ? setEditTask({ ...editTask, title: e.target.value })
                : setTitle(e.target.value)
            }
            placeholder="Task title"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          <textarea
            value={editTask ? editTask.description : description}
            onChange={(e) =>
              editTask
                ? setEditTask({ ...editTask, description: e.target.value })
                : setDescription(e.target.value)
            }
            placeholder="Task description (optional)"
            rows="3"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
          />

          {editTask ? (
            <div className="flex gap-3">
              <button
                onClick={updateTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition font-medium"
              >
                Update Task
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-xl transition font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={addTask}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition font-medium"
            >
              Create Task
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "All Tasks" : f === "pending" ? "Pending" : "Completed"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-4">Loading tasks...</p>
            </div>
          ) : currentTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
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
                  className="bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
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
                        <p className="text-sm text-gray-500 ml-8">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                      >
                        🗑️ Delete
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
  );
}