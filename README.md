# TaskFlow Pro - Task Management Application

TaskFlow Pro is a full-stack task management web application created for the Skillbit Technologies internship project requirement. It allows users to register, login, manage their own tasks, set due dates, assign priorities, edit tasks, track completion status, search tasks, and use a dark mode interface.

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js with Express.js
- Database: Local JSON files
- Task storage: `data/tasks.json`
- User storage: `data/users.json`
- Styling: Responsive CSS

## Features

- User registration and login
- Password hashing on the backend
- User-specific task lists
- New users start with an empty task list
- Create tasks with title, description, due date, and priority
- Edit existing task details
- Mark tasks as completed or pending
- Delete unwanted tasks
- Filter tasks by all, pending, completed, and overdue
- Search tasks by title, description, or priority
- Priority badges: High, Medium, and Low
- Dashboard counters for total, pending, completed, and overdue tasks
- Editable user profile with name, email, role, course, and notification preference
- Dark mode toggle with saved theme preference
- Email notification preview for tasks due soon
- REST API with validation and persistent JSON storage
- Footer credit: TaskFlow Pro © 2026 | Built by Sivani E R

## Project Structure

task_management/
├── data/
│   ├── tasks.json
│   └── users.json
│
├── docs/
│   ├── assets/
│   └── index.html
│
├── server/
│   ├── index.js
│   └── smoke-test.js
│
├── src/
│   ├── main.jsx
│   └── styles.css
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── PROJECT_REPORT.md

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
http://127.0.0.1:5173 (or the port shown by Vite)
```

The backend API runs on:

```text
http://127.0.0.1:5050
```

The Vite frontend proxies `/api` requests to the backend automatically.

## API Endpoints

- `GET /api/health` - Check API status
- `POST /api/auth/register` - Create a user account
- `POST /api/auth/login` - Login with email and password
- `PATCH /api/users/:id` - Update user profile and notification settings
- `GET /api/tasks?userId=<id>` - Fetch tasks for a logged-in user
- `POST /api/tasks` - Create a new user-specific task
- `PATCH /api/tasks/:id` - Update task fields or completion status
- `DELETE /api/tasks/:id` - Delete a task

## Verification

Run a production build:

```bash
npm run build
```

Run backend smoke tests:

```bash
node server/smoke-test.js
```
## Live Demo

https://sivanier.github.io/TaskFlow-Pro-MERN/

## Author

Sivani E R

Skillbit Technologies Full Stack Development Internship Project