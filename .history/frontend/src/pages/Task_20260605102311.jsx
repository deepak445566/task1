import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchTasks = async () => {
    const res = await api.get("/task");
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await api.post("/task", { title, description: "" });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/task/${id}`);
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await api.patch(`/task/${id}/toggle`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  const updateTask = async () => {
    await api.put(`/task/${editId}`, { title: editTitle });
    setEditId(null);
    setEditTitle("");
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Task Manager
        </h1>
        <p className="text-gray-500 mt-2">
          Organize your work, boost productivity 🚀
        </p>
      </div>

      {/* Add Task */}
      <div className="max-w-2xl mx-auto bg-white p-4 rounded-2xl shadow-md border flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="✍️ Write a new task..."
          className="flex-1 px-4 py-2 outline-none"
        />
        <button
          onClick={addTask}
          className="px-5 py-2 bg-black text-white rounded-xl hover:scale-105 transition"
        >
          Add
        </button>
      </div>

      {/* Edit Task */}
      {editId && (
        <div className="max-w-2xl mx-auto mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex gap-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-4 py-2 outline-none bg-white rounded-lg"
          />
          <button
            onClick={updateTask}
            className="px-5 py-2 bg-green-600 text-white rounded-xl hover:scale-105 transition"
          >
            Save
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="max-w-2xl mx-auto mt-8 space-y-4">

        {tasks.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No tasks yet. Create your first task ✨
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-lg transition flex justify-between items-center"
          >

            {/* Left */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {task.title}
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full mt-2 inline-block
                ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task._id)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                Toggle
              </button>

              <button
                onClick={() => startEdit(task)}
                className="px-3 py-1 text-sm bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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