import express from "express";
import cors from "cors";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const dbPath = path.join(dataDir, "tasks.json");
const usersPath = path.join(dataDir, "users.json");
const port = process.env.PORT || 5050;

const app = express();
const priorities = new Set(["High", "Medium", "Low"]);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "TaskFlow Pro API",
    status: "running",
    endpoints: {
      health: "/api/health",
      tasks: "/api/tasks",
      login: "/api/auth/login",
      register: "/api/auth/register",
      profile: "/api/users/:id"
    }
  });
});

async function ensureDatabase() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dbPath, "utf8");
  } catch {
    await writeFile(dbPath, JSON.stringify({ tasks: [] }, null, 2));
  }

  try {
    await readFile(usersPath, "utf8");
  } catch {
    await writeFile(usersPath, JSON.stringify({ users: [] }, null, 2));
  }
}

async function readDatabase() {
  await ensureDatabase();
  const raw = await readFile(dbPath, "utf8");
  return JSON.parse(raw);
}

async function writeDatabase(data) {
  await writeFile(dbPath, JSON.stringify(data, null, 2));
}

async function readUsersDatabase() {
  await ensureDatabase();
  const raw = await readFile(usersPath, "utf8");
  return JSON.parse(raw);
}

async function writeUsersDatabase(data) {
  await writeFile(usersPath, JSON.stringify(data, null, 2));
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, hash] = storedPassword.split(":");
  const candidate = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === candidate.length && timingSafeEqual(original, candidate);
}

function normalizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "Student",
    course: user.course || "Web Development Internship",
    notificationsEnabled: Boolean(user.notificationsEnabled),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function normalizeTask(task) {
  return {
    id: task.id,
    userId: task.userId || "",
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate,
    priority: priorities.has(task.priority) ? task.priority : "Medium",
    completed: Boolean(task.completed),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

function isValidDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters." });
    }

    const data = await readUsersDatabase();
    if (data.users.some((user) => user.email === email)) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const now = new Date().toISOString();
    const user = {
      id: randomUUID(),
      name,
      email,
      password: hashPassword(password),
      role: "Student",
      course: "Web Development Internship",
      notificationsEnabled: true,
      createdAt: now,
      updatedAt: now
    };

    data.users.push(user);
    await writeUsersDatabase(data);

    res.status(201).json(normalizeUser(user));
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const data = await readUsersDatabase();
    const user = data.users.find((item) => item.email === email);

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json(normalizeUser(user));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/users/:id", async (req, res, next) => {
  try {
    const data = await readUsersDatabase();
    const user = data.users.find((item) => item.id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if ("name" in req.body) {
      const name = String(req.body.name || "").trim();
      if (!name) return res.status(400).json({ message: "Name is required." });
      user.name = name;
    }

    if ("email" in req.body) {
      const email = String(req.body.email || "").trim().toLowerCase();
      if (!email) return res.status(400).json({ message: "Email is required." });
      const emailTaken = data.users.some((item) => item.email === email && item.id !== user.id);
      if (emailTaken) return res.status(409).json({ message: "Email is already in use." });
      user.email = email;
    }

    if ("role" in req.body) {
      user.role = String(req.body.role || "Student").trim();
    }

    if ("course" in req.body) {
      user.course = String(req.body.course || "Web Development Internship").trim();
    }

    if ("notificationsEnabled" in req.body) {
      user.notificationsEnabled = Boolean(req.body.notificationsEnabled);
    }

    user.updatedAt = new Date().toISOString();
    await writeUsersDatabase(data);

    res.json(normalizeUser(user));
  } catch (error) {
    next(error);
  }
});

app.get("/api/tasks", async (req, res, next) => {
  try {
    const data = await readDatabase();
    const userId = String(req.query.userId || "").trim();
    const visibleTasks = userId ? data.tasks.filter((task) => task.userId === userId) : data.tasks;
    const tasks = [...visibleTasks].map(normalizeTask).sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

app.post("/api/tasks", async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const dueDate = String(req.body.dueDate || "").trim();
    const userId = String(req.body.userId || "").trim();
    const priority = priorities.has(req.body.priority) ? req.body.priority : "Medium";

    if (!userId) {
      return res.status(400).json({ message: "User ID is required to create a task." });
    }

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    if (!isValidDate(dueDate)) {
      return res.status(400).json({ message: "A valid due date is required." });
    }

    const now = new Date().toISOString();
    const task = normalizeTask({
      id: randomUUID(),
      userId,
      title,
      description,
      dueDate,
      priority,
      completed: false,
      createdAt: now,
      updatedAt: now
    });

    const data = await readDatabase();
    data.tasks.push(task);
    await writeDatabase(data);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/tasks/:id", async (req, res, next) => {
  try {
    const data = await readDatabase();
    const task = data.tasks.find((item) => item.id === req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if ("title" in req.body) {
      const title = String(req.body.title || "").trim();
      if (!title) return res.status(400).json({ message: "Task title is required." });
      task.title = title;
    }

    if ("description" in req.body) {
      task.description = String(req.body.description || "").trim();
    }

    if ("dueDate" in req.body) {
      const dueDate = String(req.body.dueDate || "").trim();
      if (!isValidDate(dueDate)) {
        return res.status(400).json({ message: "A valid due date is required." });
      }
      task.dueDate = dueDate;
    }

    if ("priority" in req.body) {
      if (!priorities.has(req.body.priority)) {
        return res.status(400).json({ message: "Priority must be High, Medium, or Low." });
      }
      task.priority = req.body.priority;
    }

    if ("completed" in req.body) {
      task.completed = Boolean(req.body.completed);
    }

    if ("userId" in req.body) {
      const userId = String(req.body.userId || "").trim();
      if (!userId) return res.status(400).json({ message: "User ID is required." });
      task.userId = userId;
    }

    task.updatedAt = new Date().toISOString();
    await writeDatabase(data);

    res.json(normalizeTask(task));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/tasks/:id", async (req, res, next) => {
  try {
    const data = await readDatabase();
    const nextTasks = data.tasks.filter((task) => task.id !== req.params.id);

    if (nextTasks.length === data.tasks.length) {
      return res.status(404).json({ message: "Task not found." });
    }

    data.tasks = nextTasks;
    await writeDatabase(data);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server." });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Task management API running on http://localhost:${port}`);
  });
}

export default app;
