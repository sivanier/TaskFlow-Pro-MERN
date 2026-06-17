import app from "./index.js";

const server = app.listen(0, async () => {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const health = await fetch(`${baseUrl}/api/health`).then((response) => response.json());
    const tasks = await fetch(`${baseUrl}/api/tasks`).then((response) => response.json());

    if (health.status !== "ok") {
      throw new Error("Health endpoint did not return ok status.");
    }

    if (!Array.isArray(tasks)) {
      throw new Error("Tasks endpoint did not return a task array.");
    }

    console.log(`Smoke test passed with ${tasks.length} tasks.`);
  } finally {
    server.close();
  }
});
