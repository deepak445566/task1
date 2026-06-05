import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // GET TASKS
  const fetchTasks = async () => {
    const res = await api.get("/task");
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {
    if (!title.trim()) return;

    await api.post("/task", {
      title,
      description: "",
    });

    setTitle("");
    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await api.delete(`/task/${id}`);
    fetchTasks();
  };

  // TOGGLE TASK
  const toggleTask = async (id) => {
    await api.patch(`/task/${id}/toggle`);
    fetchTasks();
  };

  // START EDIT
  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  // UPDATE TASK
  const updateTask = async () => {
    await api.put(`/task/${editId}`, {
      title: editTitle,
    });

    setEditId(null);
    setEditTitle("");
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Task Manager
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your daily tasks efficiently
        </p>
      </div>

      {/* Add Task Card */}
      <div className="max-w-3xl mx-auto bg-white p-5 rounded-xl shadow border border-gray-200 mb-6">
        <div className="flex gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new task..."
            className="flex-1 px-4 py-2 border rounded-lg outline-none focus:border-black"
          />
          <button
            onClick={addTask}
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Edit Task */}
      {editId && (
        <div className="max-w-3xl mx-auto bg-yellow-50 p-5 rounded-xl border mb-6">
          <div className="flex gap-3">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg outline-none"
            />
            <button
              onClick={updateTask}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200 flex items-center justify-between"
          >
            {/* Left */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {task.title}
              </h3>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span
                  className={
                    task.status === "completed"
                      ? "text-green-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {task.status}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task._id)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Toggle
              </button>

              <button
                onClick={() => startEdit(task)}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}