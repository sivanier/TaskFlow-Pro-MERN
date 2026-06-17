import app from "./index.js";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "..", "data", "users.json");

async function removeSmokeUser(email) {
  const raw = await readFile(usersPath, "utf8");
  const data = JSON.parse(raw);
  data.users = data.users.filter((user) => user.email !== email);
  await writeFile(usersPath, JSON.stringify(data, null, 2));
}

const server = app.listen(0, async () => {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const health = await fetch(`${baseUrl}/api/health`).then((response) => response.json());
    const root = await fetch(baseUrl).then((response) => response.json());
    const tasks = await fetch(`${baseUrl}/api/tasks`).then((response) => response.json());

    if (health.status !== "ok") {
      throw new Error("Health endpoint did not return ok status.");
    }

    if (!Array.isArray(tasks)) {
      throw new Error("Tasks endpoint did not return a task array.");
    }

    if (root.status !== "running") {
      throw new Error("Root API endpoint did not return running status.");
    }

    if (tasks.some((task) => !task.priority)) {
      throw new Error("Every task should include a priority value.");
    }

    const testEmail = `smoke-${Date.now()}@taskflow.test`;
    const registeredUser = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Smoke Test User",
        email: testEmail,
        password: "secret123"
      })
    }).then((response) => response.json());

    const loggedInUser = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "secret123"
      })
    }).then((response) => response.json());

    const updatedUser = await fetch(`${baseUrl}/api/users/${registeredUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "Intern",
        notificationsEnabled: false
      })
    }).then((response) => response.json());

    if (loggedInUser.email !== testEmail || updatedUser.role !== "Intern") {
      throw new Error("Auth and profile endpoints did not return expected data.");
    }

    const newUserTasks = await fetch(`${baseUrl}/api/tasks?userId=${registeredUser.id}`).then(
      (response) => response.json()
    );

    if (!Array.isArray(newUserTasks) || newUserTasks.length !== 0) {
      throw new Error("A new user should start with an empty task list.");
    }

    const createdTask = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: registeredUser.id,
        title: "Smoke test task",
        dueDate: "2026-06-25",
        priority: "High"
      })
    }).then((response) => response.json());

    const afterCreateTasks = await fetch(`${baseUrl}/api/tasks?userId=${registeredUser.id}`).then(
      (response) => response.json()
    );

    if (afterCreateTasks.length !== 1 || createdTask.userId !== registeredUser.id) {
      throw new Error("Created task should belong only to the registered user.");
    }

    await fetch(`${baseUrl}/api/tasks/${createdTask.id}`, { method: "DELETE" });

    await removeSmokeUser(testEmail);
    console.log(`Smoke test passed with ${tasks.length} tasks.`);
  } finally {
    server.close();
  }
});
