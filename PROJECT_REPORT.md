# Project Report: Task Management Application

## 1. Project Title

TaskFlow Pro - Task Management Web Application

## 2. Objective

The objective of this project is to develop a web-based task management application that helps users organize and manage their daily tasks by creating tasks, assigning due dates, setting priorities, and tracking completion status.

## 3. Problem Statement

Students, interns, and working professionals often need a simple way to manage tasks and deadlines. Without a proper task management system, important activities may be delayed, forgotten, or poorly organized. This application solves that problem by providing a user-friendly platform to create, update, track, search, and manage tasks efficiently.

## 4. Technologies Used

* React: Used to build the interactive frontend user interface.
* Vite: Used as the frontend development and build tool.
* Express.js: Used to create the backend REST API.
* Node.js: Used as the JavaScript runtime for the backend.
* JSON Database: Used to store task and user data persistently in `data/tasks.json` and `data/users.json`.
* CSS: Used to design a responsive and clean user interface.
* Render: Used for backend deployment.
* GitHub Pages: Used for frontend deployment.

## 5. Main Modules

### Frontend Module

The frontend provides the user interface for user authentication, task creation, task management, filtering, searching, profile management, and dashboard statistics.

### Backend Module

The backend exposes REST API routes for user authentication, task management, and profile updates. It validates incoming requests and stores data in JSON files.

### Database Module

Task and user information are stored in JSON files. Task records contain title, description, due date, priority, status, and timestamps. User records contain name, email, password, role, course, and notification preferences.

## 6. Features Implemented

* User registration and login system.
* Add a new task with title, description, due date, and priority.
* Edit existing task information.
* Display user-specific tasks.
* Mark a task as completed using a checkbox.
* Filter tasks by all, pending, completed, and overdue.
* Search tasks by task name, description, or priority.
* Delete tasks that are no longer needed.
* Show task statistics including total, pending, completed, and overdue tasks.
* Edit user profile details such as name, role, course, and notification preference.
* Switch between light mode and dark mode.
* Preview email reminders for upcoming tasks.
* Validate required fields before storing tasks.
* Preserve task data using backend file storage.
* Responsive dashboard interface.
* Frontend deployment using GitHub Pages.
* Backend deployment using Render.

## 7. System Workflow

1. Users register or log in to access their personal dashboard.
2. The user enters task details in the frontend form.
3. The React application sends the task data to the Express API.
4. The Express server validates the request.
5. Valid task data is saved into the JSON database.
6. The frontend fetches updated task data and displays it to the user.
7. Users can update task completion status, edit tasks, or delete tasks through API calls.
8. Dashboard statistics and reminders are updated automatically.

## 8. How to Run the Project

1. Install Node.js.
2. Open the project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit the URL displayed in the terminal (typically `http://127.0.0.1:5173`).

## 9. Future Scope

* Replace the JSON database with MongoDB or PostgreSQL.
* Connect email notifications to a real SMTP or transactional email service.
* Implement JWT-based authentication and authorization.
* Add task categories and calendar view.
* Add browser notifications for upcoming deadlines.
* Support file attachments and task collaboration.

## 10. Conclusion

The TaskFlow Pro project successfully delivers a full-stack task management solution. The application provides user authentication, task creation, editing, deletion, priority management, due-date tracking, search and filtering capabilities, profile management, dark mode support, reminder previews, and persistent backend storage. The project demonstrates practical implementation of React, Node.js, Express.js, REST APIs, deployment, and full-stack web development concepts.
