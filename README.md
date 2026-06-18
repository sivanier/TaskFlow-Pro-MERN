# TaskFlow Pro - Task Management Application

TaskFlow Pro is a personal productivity and task management web application developed as part of the Skillbit Technologies Full Stack Development Internship. The application helps users organize tasks, track deadlines, manage priorities, and improve productivity through a simple and user-friendly interface.

## Live Demo

Frontend: https://sivanier.github.io/TaskFlow-Pro-MERN/

Backend API: https://taskflow-pro-api-2497.onrender.com

## Tech Stack

* Frontend: React with Vite
* Backend: Node.js with Express.js
* Database: Local JSON Files
* Deployment:

  * Frontend: GitHub Pages
  * Backend: Render
* Styling: Responsive CSS

## Features

* User Registration and Login
* Secure Password Hashing
* User-Specific Task Management
* Create Tasks with Title, Description, Due Date, and Priority
* Edit Existing Tasks
* Mark Tasks as Completed or Pending
* Delete Tasks
* Filter Tasks by All, Pending, Completed, and Overdue
* Search Tasks by Title, Description, or Priority
* Priority Levels (High, Medium, Low)
* Dashboard Statistics
* User Profile Management
* Notification Preferences
* Dark Mode Support
* Upcoming Task Reminder Preview
* REST API Integration
* Persistent Data Storage
* Responsive User Interface

## Project Structure

```text
task_management/
├── data/
│   ├── tasks.json
│   └── users.json
├── docs/
│   ├── assets/
│   └── index.html
├── server/
│   ├── index.js
│   └── smoke-test.js
├── src/
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
└── PROJECT_REPORT.md
```

## How to Run Locally

Install dependencies:

```bash
npm install
```

Start the frontend and backend:

```bash
npm run dev
```

Open the application:

```text
http://127.0.0.1:5173
```

Backend API:

```text
http://127.0.0.1:5050
```

## API Endpoints

* GET /api/health
* POST /api/auth/register
* POST /api/auth/login
* PATCH /api/users/:id
* GET /api/tasks?userId=<id>
* POST /api/tasks
* PATCH /api/tasks/:id
* DELETE /api/tasks/:id

## Verification

Build the project:

```bash
npm run build
```

Run backend smoke tests:

```bash
node server/smoke-test.js
```

## Author

**Sivani E R**

Skillbit Technologies – Full Stack Development Internship Project
