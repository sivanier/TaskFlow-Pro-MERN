import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const dbPath = path.join(dataDir, "tasks.json");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "TaskFlow Pro API",
    status: "running",
    endpoints: {
      health: "/api/health",
      tasks: "/api/tasks"
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
}

async function readDatabase() {
  await ensureDatabase();
  const raw = await readFile(dbPath, "utf8");
  return JSON.parse(raw);
}

async function writeDatabase(data) {
  await writeFile(dbPath, JSON.stringify(data, null, 2));
}

function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate,
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

app.get("/api/tasks", async (req, res, next) => {
  try {
    const data = await readDatabase();
    const tasks = [...data.tasks].sort((a, b) => {
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

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    if (!isValidDate(dueDate)) {
      return res.status(400).json({ message: "A valid due date is required." });
    }

    const now = new Date().toISOString();
    const task = normalizeTask({
      id: randomUUID(),
      title,
      description,
      dueDate,
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

    if ("completed" in req.body) {
      task.completed = Boolean(req.body.completed);
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
