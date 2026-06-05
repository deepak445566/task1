import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FETCH TASKS
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
      description,
    });

    setTitle("");
    setDescription("");
    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await api.delete(`/task/${id}`);
    fetchTasks();
  };

  // TOGGLE STATUS
  const toggleTask = async (id) => {
    await api.patch(`/task/${id}/toggle`);
    fetchTasks();
  };

  // EDIT START
  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  // UPDATE TASK
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

  // PAGINATION LOGIC
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Task Dashboard
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* ADD TASK */}
          <div className="bg-white p-5 rounded-2xl shadow border">
            <h2 className="text-lg font-semibold mb-3">➕ Add Task</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="w-full mt-2 px-4 py-2 border rounded-lg"
            />

            <button
              onClick={addTask}
              className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Add Task
            </button>
          </div>

          {/* EDIT */}
          {editId && (
            <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl">
              <h2>Edit Task</h2>

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full mt-2 px-4 py-2 border rounded-lg"
              />

              <button
                onClick={updateTask}
                className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - TASK LIST */}
        <div className="bg-white p-5 rounded-2xl shadow border">

          <h2 className="text-lg font-semibold mb-4">
            📋 All Tasks
          </h2>

          {currentTasks.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">
              No tasks yet ✨
            </p>
          ) : (
            <div className="space-y-3">
              {currentTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-4 border rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {task.description}
                      </p>
                    )}

                    <span className="text-xs px-3 py-1 rounded-full mt-2 inline-block bg-gray-100">
                      {task.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => toggleTask(task._id)}>
                      Toggle
                    </button>

                    <button onClick={() => startEdit(task)}>
                      Edit
                    </button>

                    <button onClick={() => deleteTask(task._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          <div className="flex justify-center items-center gap-3 mt-6">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}