import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = "http://localhost:5000/api/tasks";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function getDueState(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);

  if (task.completed) return "done";
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "today";
  return "upcoming";
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().slice(0, 10)
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Unable to load tasks.");
      setTasks(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const overdue = tasks.filter((task) => getDueState(task) === "overdue").length;
    return { total, completed, pending: total - completed, overdue };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      if (filter === "overdue") return getDueState(task) === "overdue";
      return true;
    });
  }, [tasks, filter]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to create task.");

      setTasks((current) => [payload, ...current]);
      setForm({
        title: "",
        description: "",
        dueDate: new Date().toISOString().slice(0, 10)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateTask(id, changes) {
    const previous = tasks;
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...changes } : task))
    );
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes)
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Unable to update task.");

      setTasks((current) => current.map((task) => (task.id === id ? payload : task)));
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    const previous = tasks;
    setTasks((current) => current.filter((task) => task.id !== id));
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Unable to delete task.");
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="topbar">
          <div>
            <p className="eyebrow">Stay Organized. Stay Productive.</p>
            <h1>TASKFLOW PRO</h1>
          </div>
          <button className="ghost-button" onClick={loadTasks} disabled={loading}>
            Refresh
          </button>
        </div>

        <section className="stats-grid" aria-label="Task summary">
          <div>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>
          <div>
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
          <div>
            <span>Overdue</span>
            <strong>{stats.overdue}</strong>
          </div>
        </section>

        <section className="content-grid">
          <form className="task-form" onSubmit={handleSubmit}>
            <h2>Create Task</h2>
            <label>
              Task name
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Enter task title"
                required
              />
            </label>
            <label>
              Due date
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Add useful details"
                rows="5"
              />
            </label>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Task"}
            </button>
          </form>

          <section className="task-panel">
            <div className="panel-header">
              <h2>Tasks</h2>
              <div className="filters" aria-label="Task filters">
                {["all", "pending", "completed", "overdue"].map((item) => (
                  <button
                    key={item}
                    className={filter === item ? "active" : ""}
                    onClick={() => setFilter(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            {loading && <p className="empty-state">Loading tasks...</p>}
            {!loading && filteredTasks.length === 0 && (
              <p className="empty-state">No tasks match this view.</p>
            )}

            <div className="task-list">
              {filteredTasks.map((task) => {
                const dueState = getDueState(task);
                return (
                  <article className={`task-card ${task.completed ? "is-complete" : ""}`} key={task.id}>
                    <div className="task-main">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(event) => updateTask(task.id, { completed: event.target.checked })}
                        aria-label={`Mark ${task.title} as completed`}
                      />
                      <div>
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                      </div>
                    </div>
                    <div className="task-meta">
                      <span className={`status-pill ${dueState}`}>{dueState}</span>
                      <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
                      <button className="delete-button" onClick={() => deleteTask(task.id)} type="button">
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
