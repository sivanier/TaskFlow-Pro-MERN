# Project Report: Task Management Application

## 1. Project Title

TaskFlow Pro - Task Management Web Application

## 2. Objective

The objective of this project is to develop a full-stack task management web application that helps users organize their personal work by creating tasks, assigning due dates, setting priorities, tracking completion status, and managing their profile.

## 3. Problem Statement

Students, interns, and working professionals often need a simple way to manage tasks and deadlines. Without a task management tool, important work can be delayed or forgotten. TaskFlow Pro solves this problem by providing a user-friendly web application where each user can register, login, and manage their own task list.

## 4. Technologies Used

- React: Used to build the interactive frontend user interface.
- Vite: Used as the frontend development and build tool.
- Express.js: Used to create the backend REST API.
- Node.js: Used as the JavaScript runtime for the backend.
- JSON Database: Used to store user and task records persistently.
- CSS: Used to design a responsive light and dark mode interface.

## 5. Main Modules

### Authentication Module

The authentication module allows users to register and login with an email and password. Passwords are hashed on the backend before being stored in the JSON user database.

### Task Management Module

The task module allows logged-in users to create, edit, complete, search, filter, and delete tasks. Each task belongs to a specific user, so new users start with an empty task list.

### User Profile Module

The profile module lets users update their name, email, role, course, and notification preference.

### Notification Module

The notification section previews email reminders for tasks due soon. Real email delivery can be connected later through SMTP or a transactional email service.

### Theme Module

The theme module allows users to switch between light mode and dark mode. The selected theme is saved in browser storage.

### Backend Module

The backend exposes REST API routes for authentication, user profiles, and task operations. It validates incoming data and saves records to local JSON files.

### Database Module

User data is stored in `data/users.json`, and task data is stored in `data/tasks.json`. Each task includes an ID, user ID, title, description, due date, priority, completion status, creation time, and update time.

## 6. Features Implemented

- Register and login with user account details.
- Store hashed passwords instead of plain text passwords.
- Show each logged-in user only their own task list.
- Show an empty task list for newly registered users.
- Add a new task with title, description, due date, and priority.
- Edit existing task information.
- Mark a task as completed using a checkbox.
- Filter tasks by all, pending, completed, and overdue.
- Search tasks by task name, description, or priority.
- Delete tasks that are no longer needed.
- Show task statistics including total, pending, completed, and overdue tasks.
- Edit user profile details such as name, email, role, course, and notification preference.
- Switch between light mode and dark mode.
- Preview email reminders for tasks due soon.
- Validate required fields before storing data.
- Preserve user and task data after refresh using backend JSON storage.

## 7. System Workflow

1. The user registers or logs in through the React frontend.
2. The frontend sends authentication data to the Express backend.
3. The backend validates the request and returns the logged-in user profile.
4. The frontend fetches tasks using the logged-in user's ID.
5. A new user receives an empty task list.
6. The user can create, edit, complete, filter, search, or delete tasks.
7. The backend saves task and profile updates to JSON files.

## 8. How to Run the Project

1. Install Node.js.
2. Open the project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit `http://127.0.0.1:5173` in a browser.

The backend runs on `http://127.0.0.1:5050`, and the frontend proxies `/api` requests to that backend.

## 9. Testing and Verification

The project was verified using:

- `npm run build`
- `node server/smoke-test.js`

The smoke test checks backend health, authentication, profile update, user-specific empty task lists, task creation, and cleanup.

## 10. Future Scope

- Replace the JSON database with MongoDB or PostgreSQL.
- Connect email notifications to a real SMTP or transactional email service.
- Add task categories and calendar view.
- Add browser push reminders for upcoming deadlines.
- Add password reset functionality.
- Add profile image upload.

## 11. Conclusion

TaskFlow Pro successfully meets the requirement of a task management web application. It includes user registration, login, user-specific task management, task creation, due date management, priority badges, completion tracking, filtering, searching, editing, deletion, dark mode, user profile management, notification preview, REST API integration, and persistent JSON storage.
