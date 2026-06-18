# Project Report: Task Management Application

## 1. Project Title

TaskFlow Pro - Task Management Web Application

## 2. Objective

The objective of this project is to develop a web-based task management application that helps users organize work by creating tasks, assigning due dates, and tracking completion status.

## 3. Problem Statement

Students, interns, and working professionals often need a simple way to track tasks and deadlines. Without a task management tool, important work can be missed or delayed. This application solves that problem by providing an easy interface to add, view, complete, filter, and delete tasks.

## 4. Technologies Used

- React: Used to build the interactive frontend user interface.
- Vite: Used as the frontend development and build tool.
- Express.js: Used to create the backend REST API.
- Node.js: Used as the JavaScript runtime for the backend.
- JSON Database: Used to store task and user data persistently in data/tasks.json and data/users.json.
- CSS: Used to design a responsive and clean user interface.

## 5. Main Modules

### Frontend Module

The frontend provides the user interface for creating tasks, checking task summaries, filtering records, marking tasks complete, and deleting tasks.

### Backend Module

The backend exposes REST API routes for task operations. It validates incoming data and saves records to the local JSON database.

### Database Module

Task and user information are stored in JSON files. Task records contain title, description, due date, priority, status, and timestamps. User records contain name, email, password, role, course, and notification preferences. Each task includes an ID, title, description, due date, completion status, creation time, and update time.

## 6. Features Implemented

- Add a new task with title, description, due date, and priority.
- Edit existing task information.
- Display all tasks from the database.
- Mark a task as completed using a checkbox.
- Filter tasks by all, pending, completed, and overdue.
- Search tasks by task name, description, or priority.
- Delete tasks that are no longer needed.
- Show task statistics including total, pending, completed, and overdue tasks.
- Register and login with user account details.
- Edit user profile details such as name, role, course, and notification preference.
- Switch between light mode and dark mode.
- Preview email reminders for tasks due soon.
- Validate required fields before storing tasks.
- Preserve task data after page refresh using backend file storage.

## 7. System Workflow

1. Users register or log in to access their personal dashboard.
2. The user enters task details in the frontend form.
3. The React application sends the task data to the Express API.
4. The Express server validates the request.
5. Valid task data is saved into the JSON database.
6. The frontend fetches updated task data and displays it to the user.
7. Users can update task completion status or delete tasks through API calls.

## 8. How to Run the Project

1. Install Node.js.
2. Open the project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit the URL displayed in the terminal (typically http://127.0.0.1:5173).

## 9. Future Scope

- Replace the JSON database with MongoDB or PostgreSQL.
- Connect email notifications to a real SMTP or transactional email service.
- Implement JWT-based authentication and authorization.
- Add task categories and calendar view.
- Add email or browser reminders for upcoming deadlines.

## 10. Conclusion

The TaskFlow Pro project successfully delivers a full-stack task management solution. The application provides user authentication, task creation, editing, deletion, priority management, due-date tracking, search and filtering capabilities, profile management, dark mode support, and persistent backend storage. The project demonstrates practical implementation of React, Node.js, Express.js, REST APIs, and full-stack development concepts.