import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, completed

  // 🔥 GET ALL TASKS
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

  // ➕ CREATE TASK
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await api.post("/task", {
        title,
        description: "",
      });
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ❌ DELETE TASK
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await api.delete(`/task/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // 🔁 TOGGLE STATUS
  const toggleTask = async (id) => {
    try {
      await api.patch(`/task/${id}/toggle`);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // ✏️ START EDIT
  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  // 💾 UPDATE TASK
  const updateTask = async () => {
    if (!editTitle.trim()) return;

    try {
      await api.put(`/task/${editId}`, {
        title: editTitle,
      });
      setEditId(null);
      setEditTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;

  // Handle Enter key press
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>✨ Task Manager</h1>
        <div style={styles.stats}>
          <span style={styles.statBadge}>Total: {totalTasks}</span>
          <span style={{...styles.statBadge, ...styles.pendingBadge}}>
            Pending: {pendingTasks}
          </span>
          <span style={{...styles.statBadge, ...styles.completedBadge}}>
            Completed: {completedTasks}
          </span>
        </div>
      </div>

      {/* CREATE TASK SECTION */}
      <div style={styles.addSection}>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, addTask)}
          placeholder="What needs to be done?"
          type="text"
        />
        <button style={styles.addButton} onClick={addTask}>
          + Add Task
        </button>
      </div>

      {/* FILTER TABS */}
      <div style={styles.filterTabs}>
        <button
          style={{...styles.filterButton, ...(filter === "all" && styles.activeFilter)}}
          onClick={() => setFilter("all")}
        >
          All Tasks
        </button>
        <button
          style={{...styles.filterButton, ...(filter === "pending" && styles.activeFilter)}}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          style={{...styles.filterButton, ...(filter === "completed" && styles.activeFilter)}}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* EDIT TASK MODAL */}
      {editId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Edit Task</h3>
            <input
              style={styles.modalInput}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, updateTask)}
              placeholder="Update task title"
              autoFocus
            />
            <div style={styles.modalButtons}>
              <button style={styles.cancelButton} onClick={cancelEdit}>
                Cancel
              </button>
              <button style={styles.updateButton} onClick={updateTask}>
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TASK LIST */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading your tasks...</p>
        </div>
      ) : (
        <div style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <p>🎉 No tasks here!</p>
              <p style={styles.emptyStateSub}>Add a new task to get started</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} style={styles.taskCard}>
                <div style={styles.taskContent}>
                  <div style={styles.taskInfo}>
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleTask(task._id)}
                      style={styles.checkbox}
                    />
                    <span
                      style={{
                        ...styles.taskTitle,
                        ...(task.status === "completed" && styles.completedTask),
                      }}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div style={styles.taskActions}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(task.status === "completed" ? styles.completedStatus : styles.pendingStatus),
                      }}
                    >
                      {task.status}
                    </span>
                    <button
                      style={{...styles.iconButton, ...styles.editButton}}
                      onClick={() => startEdit(task)}
                      title="Edit task"
                    >
                      ✏️
                    </button>
                    <button
                      style={{...styles.iconButton, ...styles.deleteButton}}
                      onClick={() => deleteTask(task._id)}
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    color: "#333",
    fontSize: "2.5rem",
    marginBottom: "15px",
  },
  stats: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  statBadge: {
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: "#e0e0e0",
    fontSize: "14px",
    fontWeight: "500",
  },
  pendingBadge: {
    backgroundColor: "#fff3e0",
    color: "#f59c11",
  },
  completedBadge: {
    backgroundColor: "#e8f5e9",
    color: "#4caf50",
  },
  addSection: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  addButton: {
    padding: "12px 24px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  filterTabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "10px",
  },
  filterButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    color: "#666",
    transition: "all 0.3s",
  },
  activeFilter: {
    backgroundColor: "#4caf50",
    color: "white",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  taskContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  taskInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  taskTitle: {
    fontSize: "16px",
    color: "#333",
    wordBreak: "break-word",
  },
  completedTask: {
    textDecoration: "line-through",
    color: "#999",
  },
  taskActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  pendingStatus: {
    backgroundColor: "#fff3e0",
    color: "#f59c11",
  },
  completedStatus: {
    backgroundColor: "#e8f5e9",
    color: "#4caf50",
  },
  iconButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "opacity 0.2s",
  },
  editButton: {
    backgroundColor: "#2196f3",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    margin: "0 0 20px 0",
    color: "#333",
  },
  modalInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "6px",
    marginBottom: "20px",
    outline: "none",
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  updateButton: {
    padding: "8px 16px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
  spinner: {
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #4caf50",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#999",
  },
  emptyStateSub: {
    fontSize: "14px",
    marginTop: "10px",
  },
};

// Add this to your global CSS or include in component
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #4caf50 !important;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  .task-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;
document.head.appendChild(styleSheet);