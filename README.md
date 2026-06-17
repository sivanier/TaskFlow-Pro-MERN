# Task Management Application

TaskFlow Manager is a full-stack task management web application created for the Skillbit Technologies internship project requirement. It lets users create tasks, set due dates, view task status, mark tasks as completed, filter tasks, and delete tasks.

## Tech Stack

- Frontend: React with Vite
- Backend: Express.js
- Database: Local JSON database stored in `data/tasks.json`
- Styling: Responsive CSS

## Features

- Create tasks with title, description, and due date
- View all saved tasks
- Mark tasks as completed or pending
- Filter tasks by all, pending, completed, and overdue
- Delete unwanted tasks
- Dashboard counters for total, pending, completed, and overdue tasks
- REST API with validation and persistent storage

## Project Structure

```text
task_management/
  data/tasks.json
  server/index.js
  src/main.jsx
  src/styles.css
  index.html
  package.json
  README.md
  PROJECT_REPORT.md
```

## How to Run

Install dependencies:

```bash
npm install
```

Start the frontend and backend together:

```bash
npm run dev
```

Open the app:

```text
http://127.0.0.1:5173
```

The backend API runs on:

```text
http://localhost:5000
```

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update task fields or completion status
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/health` - Check API status
