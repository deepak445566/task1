import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTasks = async () => {
    const res = await api.get("/task");
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await api.post("/task", { title, description });

    setTitle("");
    setDescription("");
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
    setEditDescription(task.description || "");
  };

  const updateTask = async () => {
    await api.put(`/task/${editId}`, {
      title: editTitle,
      description: editDescription,
    });

    setEditId(null);
    setEditTitle("");
    setEditDescription("");
    fetchTasks();
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-black tracking-tight">
          Task Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your tasks efficiently
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* ADD CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-4">➕ Add Task</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full mb-3 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
            />

            <button
              onClick={addTask}
              className="w-full mt-4 bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition"
            >
              Add Task
            </button>
          </div>

          {/* EDIT CARD */}
          {editId && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">✏️ Edit Task</h2>

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full mb-3 px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
              />

              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-black"
              />

              <button
                onClick={updateTask}
                className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-5">📋 All Tasks</h2>

          {currentTasks.length === 0 ? (
            <p className="text-gray-400 text-center py-10">
              No tasks yet ✨
            </p>
          ) : (
            <div className="space-y-4">
              {currentTasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex justify-between items-start"
                >

                  {/* LEFT */}
                  <div>
                    <h3 className="font-semibold text-black">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description}
                      </p>
                    )}

                    <span
                      className={`inline-block mt-3 text-xs px-3 py-1 rounded-full
                      ${
                        task.status === "completed"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col gap-2 text-xs">
                    <button
                      onClick={() => toggleTask(task._id)}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => startEdit(task)}
                      className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="px-3 py-1 border rounded-lg hover:bg-black hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4 mt-8">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border rounded-xl disabled:opacity-40 hover:bg-gray-100"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-xl disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}