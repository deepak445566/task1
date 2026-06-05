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

  // ---------------- FETCH TASKS ----------------
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

  // ---------------- ADD TASK ----------------
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

  // ---------------- DELETE TASK ----------------
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/task/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- TOGGLE STATUS ----------------
  const toggleTask = async (id) => {
    try {
      await api.patch(`/task/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- EDIT ----------------
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

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }
  };

  // ---------------- FILTER TASKS ----------------
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "pending") return task.status === "pending";
      if (filter === "completed") return task.status === "completed";
      return true;
    });
  }, [tasks, filter]);

  // ---------------- PAGINATION ----------------
  const currentTasks = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredTasks.slice(indexOfFirst, indexOfLast);
  }, [filteredTasks, currentPage]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // ---------------- STATS ----------------
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;

    return {
      total: tasks.length,
      completed,
      pending,
    };
  }, [tasks]);

  // reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="flex gap-4 mb-6">
        <div>Total: {stats.total}</div>
        <div>Pending: {stats.pending}</div>
        <div>Completed: {stats.completed}</div>
      </div>

      {/* ADD / EDIT FORM */}
      <div className="bg-white p-4 rounded mb-6">
        <input
          value={editTask ? editTask.title : title}
          onChange={(e) =>
            editTask
              ? setEditTask({ ...editTask, title: e.target.value })
              : setTitle(e.target.value)
          }
          placeholder="Task title"
          className="border p-2 w-full mb-2"
        />

        <textarea
          value={editTask ? editTask.description : description}
          onChange={(e) =>
            editTask
              ? setEditTask({ ...editTask, description: e.target.value })
              : setDescription(e.target.value)
          }
          placeholder="Description"
          className="border p-2 w-full mb-2"
        />

        {editTask ? (
          <div className="flex gap-2">
            <button
              onClick={updateTask}
              className="bg-blue-500 text-white px-4 py-2"
            >
              Update
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-4 py-2"
          >
            Add Task
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-4">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 border ${
              filter === f ? "bg-black text-white" : ""
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {currentTasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded flex justify-between">
              <div>
                <h3 className={task.status === "completed" ? "line-through" : ""}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggleTask(task._id)}>✔</button>
                <button onClick={() => startEdit(task)}>✏</button>
                <button onClick={() => deleteTask(task._id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex gap-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "font-bold" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}