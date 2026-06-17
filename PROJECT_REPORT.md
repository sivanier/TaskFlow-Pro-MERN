# Project Report: Task Management Application

## 1. Project Title

TaskFlow Manager - Task Management Web Application

## 2. Objective

The objective of this project is to develop a web-based task management application that helps users organize work by creating tasks, assigning due dates, and tracking completion status.

## 3. Problem Statement

Students, interns, and working professionals often need a simple way to track tasks and deadlines. Without a task management tool, important work can be missed or delayed. This application solves that problem by providing an easy interface to add, view, complete, filter, and delete tasks.

## 4. Technologies Used

- React: Used to build the interactive frontend user interface.
- Vite: Used as the frontend development and build tool.
- Express.js: Used to create the backend REST API.
- Node.js: Used as the JavaScript runtime for the backend.
- JSON Database: Used to store task records persistently in `data/tasks.json`.
- CSS: Used to design a responsive and clean user interface.

## 5. Main Modules

### Frontend Module

The frontend provides the user interface for creating tasks, checking task summaries, filtering records, marking tasks complete, and deleting tasks.

### Backend Module

The backend exposes REST API routes for task operations. It validates incoming data and saves records to the local JSON database.

### Database Module

Task data is stored in a JSON file. Each task includes an ID, title, description, due date, completion status, creation time, and update time.

## 6. Features Implemented

- Add a new task with title, description, and due date.
- Display all tasks from the database.
- Mark a task as completed using a checkbox.
- Filter tasks by all, pending, completed, and overdue.
- Delete tasks that are no longer needed.
- Show task statistics including total, pending, completed, and overdue tasks.
- Validate required fields before storing tasks.
- Preserve task data after page refresh using backend file storage.

## 7. System Workflow

1. The user enters task details in the frontend form.
2. The React application sends the task data to the Express API.
3. The Express server validates the request.
4. Valid task data is saved into the JSON database.
5. The frontend fetches updated task data and displays it to the user.
6. Users can update task completion status or delete tasks through API calls.

## 8. How to Run the Project

1. Install Node.js.
2. Open the project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit `http://127.0.0.1:5173` in a browser.

## 9. Future Scope

- Add user login and authentication.
- Add priority levels for tasks.
- Add edit task functionality in the user interface.
- Replace the JSON database with MongoDB or PostgreSQL.
- Add task categories and calendar view.
- Add email or browser reminders for upcoming deadlines.

## 10. Conclusion

The TaskFlow Manager project successfully meets the requirement of a task management web application. It includes task creation, due date management, completion tracking, filtering, deletion, REST API integration, and persistent database storage.
