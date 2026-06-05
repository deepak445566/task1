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
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* TOP HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Task Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage tasks like a pro 🚀
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SIDE - ADD + EDIT */}
        <div className="space-y-6">

          {/* Add Task */}
          <div className="bg-white p-5 rounded-2xl shadow border">
            <h2 className="text-lg font-semibold mb-3">➕ Add Task</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task..."
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-black"
            />

            <button
              onClick={addTask}
              className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Add Task
            </button>
          </div>

          {/* Edit Task */}
          {editId && (
            <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl">
              <h2 className="text-lg font-semibold mb-3">✏️ Edit Task</h2>

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <button
                onClick={updateTask}
                className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - TASK LIST */}
        <div className="bg-white p-5 rounded-2xl shadow border">
          <h2 className="text-lg font-semibold mb-4">📋 All Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              No tasks yet ✨
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 border rounded-xl flex justify-between items-center hover:shadow-md transition"
                >

                  {/* LEFT */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
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

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleTask(task._id)}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => startEdit(task)}
                      className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}