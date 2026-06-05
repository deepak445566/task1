import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // 🔥 GET ALL TASKS
  const fetchTasks = async () => {
    const res = await api.get("/task");
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ➕ CREATE TASK
  const addTask = async () => {
    if (!title) return;

    await api.post("/tasks", {
      title,
      description: "",
    });

    setTitle("");
    fetchTasks();
  };

  // ❌ DELETE TASK
  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // 🔁 TOGGLE STATUS
  const toggleTask = async (id) => {
    await api.patch(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  // ✏️ START EDIT
  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  // 💾 UPDATE TASK
  const updateTask = async () => {
    await api.put(`/tasks/${editId}`, {
      title: editTitle,
    });

    setEditId(null);
    setEditTitle("");
    fetchTasks();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Manager</h2>

      {/* CREATE TASK */}
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <hr />

      {/* EDIT TASK */}
      {editId && (
        <div>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button onClick={updateTask}>Update</button>
        </div>
      )}

      <hr />

      {/* TASK LIST */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: "10px" }}>
            <b>{task.title}</b> - {task.status}

            <div>
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
          </li>
        ))}
      </ul>
    </div>
  );
}