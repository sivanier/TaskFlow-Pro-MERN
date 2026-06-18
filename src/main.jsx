import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_BASE_URL =
  window.location.hostname === "sivanier.github.io"
    ? "https://taskflow-pro-api-2497.onrender.com/api"
    : "/api";
const API_URL = `${API_BASE_URL}/tasks`;
const emptyForm = {
  title: "",
  description: "",
  dueDate: new Date().toISOString().slice(0, 10),
  priority: "Medium"
};
const emptyAuthForm = {
  name: "",
  email: "",
  password: ""
};

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

async function readApiResponse(response, fallbackMessage) {
  const text = await response.text();
  let payload = {};

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error(
        "Backend API is not updated or not running. Stop the old server and run npm run dev again."
      );
    }
  }

  if (!response.ok) {
    throw new Error(payload.message || fallbackMessage);
  }

  return payload;
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("taskflow-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [profileForm, setProfileForm] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("taskflow-theme") === "dark");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    localStorage.setItem("taskflow-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("taskflow-user", JSON.stringify(user));
      setProfileForm({
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        notificationsEnabled: user.notificationsEnabled
      });
    } else {
      localStorage.removeItem("taskflow-user");
      setProfileForm(null);
    }
  }, [user]);

  async function loadTasks() {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}?userId=${encodeURIComponent(user.id)}`);
      setTasks(await readApiResponse(response, "Unable to load tasks."));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const overdue = tasks.filter((task) => getDueState(task) === "overdue").length;
    return { total, completed, pending: total - completed, overdue };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.priority || "Medium").toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      if (filter === "overdue") return getDueState(task) === "overdue";
      return true;
    });
  }, [tasks, filter, searchTerm]);

  const dueSoonTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return !task.completed && dueDate >= today && dueDate <= threeDaysFromNow;
    });
  }, [tasks]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const endpoint = authMode === "login" ? "login" : "register";
      const body =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const payload = await readApiResponse(response, "Authentication failed.");

      setUser(payload);
      setAuthForm(emptyAuthForm);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setAuthForm(emptyAuthForm);
  }

  async function updateProfile(event) {
    event.preventDefault();
    if (!user || !profileForm) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });
      const payload = await readApiResponse(response, "Unable to update profile.");

      setUser(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user.id })
      });

      const payload = await readApiResponse(
        response,
        `Unable to ${editingId ? "update" : "create"} task.`
      );

      setTasks((current) =>
        editingId
          ? current.map((task) => (task.id === editingId ? payload : task))
          : [payload, ...current]
      );
      setForm(emptyForm);
      setEditingId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority || "Medium"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId("");
    setForm(emptyForm);
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

      const payload = await readApiResponse(response, "Unable to update task.");

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
      if (!response.ok) {
        await readApiResponse(response, "Unable to delete task.");
      }
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  return (
    <main className={`app-shell ${darkMode ? "dark-mode" : ""}`}>
      <section className="workspace">
        <div className="topbar">
          <div>
            <p className="eyebrow">Stay Organized. Stay Productive.</p>
            <h1>TASKFLOW PRO</h1>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" onClick={() => setDarkMode((current) => !current)}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            {user && (
              <>
                <button className="ghost-button" onClick={loadTasks} disabled={loading}>
                  Refresh
                </button>
                <button className="ghost-button" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {!user ? (
          <section className="auth-layout">
            <form className="auth-card" onSubmit={handleAuthSubmit}>
              <div className="form-heading">
                <h2>{authMode === "login" ? "Login" : "Register"}</h2>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setAuthError("");
                  }}
                >
                  {authMode === "login" ? "Create account" : "Use login"}
                </button>
              </div>
              {authMode === "register" && (
                <label>
                  Full name
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                  placeholder="name@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                  placeholder="Minimum 6 characters"
                  required
                />
              </label>
              {authError && <p className="error-message">{authError}</p>}
              <button className="primary-button" type="submit" disabled={authLoading}>
                {authLoading ? "Please wait..." : authMode === "login" ? "Login" : "Register"}
              </button>
            </form>
          </section>
        ) : (
          <>
            <section className="user-strip">
              <div>
                <span>Signed in as</span>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
              <div>
                <span>Email alerts</span>
                <strong>{user.notificationsEnabled ? "Enabled" : "Disabled"}</strong>
                <small>{dueSoonTasks.length} upcoming reminders</small>
              </div>
            </section>

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
                <div className="form-heading">
                  <h2>{editingId ? "Edit Task" : "Create Task"}</h2>
                  {editingId && (
                    <button className="text-button" type="button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  )}
                </div>
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
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) => setForm({ ...form, priority: event.target.value })}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
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
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Task"}
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

                <label className="search-box">
                  Search tasks
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by task, description, or priority"
                  />
                </label>

                {error && <p className="error-message">{error}</p>}
                {loading && <p className="empty-state">Loading tasks...</p>}
                {!loading && filteredTasks.length === 0 && (
                  <p className="empty-state">No tasks match this view.</p>
                )}

                <div className="task-list">
                  {filteredTasks.map((task) => {
                    const dueState = getDueState(task);
                    return (
                      <article
                        className={`task-card ${task.completed ? "is-complete" : ""}`}
                        key={task.id}
                      >
                        <div className="task-main">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(event) =>
                              updateTask(task.id, { completed: event.target.checked })
                            }
                            aria-label={`Mark ${task.title} as completed`}
                          />
                          <div>
                            <h3>{task.title}</h3>
                            {task.description && <p>{task.description}</p>}
                          </div>
                        </div>
                        <div className="task-meta">
                          <span className={`priority-pill ${(task.priority || "Medium").toLowerCase()}`}>
                            {task.priority || "Medium"}
                          </span>
                          <span className={`status-pill ${dueState}`}>{dueState}</span>
                          <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
                          <button className="edit-button" onClick={() => startEdit(task)} type="button">
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => deleteTask(task.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </section>

            <section className="profile-grid">
              <form className="profile-card" onSubmit={updateProfile}>
                <h2>User Profile</h2>
                <label>
                  Name
                  <input
                    type="text"
                    value={profileForm?.name || ""}
                    onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={profileForm?.email || ""}
                    onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                    required
                  />
                </label>
                <label>
                  Role
                  <input
                    type="text"
                    value={profileForm?.role || ""}
                    onChange={(event) => setProfileForm({ ...profileForm, role: event.target.value })}
                  />
                </label>
                <label>
                  Course
                  <input
                    type="text"
                    value={profileForm?.course || ""}
                    onChange={(event) => setProfileForm({ ...profileForm, course: event.target.value })}
                  />
                </label>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={Boolean(profileForm?.notificationsEnabled)}
                    onChange={(event) =>
                      setProfileForm({ ...profileForm, notificationsEnabled: event.target.checked })
                    }
                  />
                  Enable email notifications
                </label>
                <button className="primary-button" type="submit" disabled={saving}>
                  Save Profile
                </button>
              </form>

              <section className="notification-card">
                <h2>Email Notifications</h2>
                {user.notificationsEnabled ? (
                  dueSoonTasks.length > 0 ? (
                    <div className="notification-list">
                      {dueSoonTasks.map((task) => (
                        <article key={task.id}>
                          <strong>{task.title}</strong>
                          <span>
                            Reminder prepared for {user.email} - due {formatDate(task.dueDate)}
                          </span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No upcoming tasks need reminders.</p>
                  )
                ) : (
                  <p className="empty-state">Enable email notifications from your profile.</p>
                )}
              </section>
            </section>
          </>
        )}
        <footer className="app-footer">TaskFlow Pro &copy; 2026 | Built by Sivani E R</footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
