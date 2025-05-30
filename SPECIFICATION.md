# Task Manager Application

## Objective
Develop a simple, full-stack Task Manager application that allows users to create, view, update, and delete tasks. The application should demonstrate proficiency in Next.js (for the frontend), React (for UI components), and Node.js (for the backend API).

## Core Requirements

#### 1. Frontend (Next.js & React)
- Display a list of tasks. Each task should show its title, description, and status (e.g., "Pending", "Completed").
- Allow users to add new tasks (title, description, initial status).
- Allow users to edit existing tasks (title, description, status).
- Allow users to delete tasks.
- Implement basic form validation for adding/editing tasks (e.g., title is required).
- Ensure the application is responsive and works well on various screen sizes (mobile, tablet, desktop).

#### 2. Backend (Node.js)
- Create a RESTful API to manage tasks.
- Implement endpoints for: 
  - `GET /api/tasks`: Retrieve all tasks.
  - `POST /api/tasks`: Create a new task.
  - `PUT /api/tasks/:id`: Update an existing task.
  - `DELETE /api/tasks/:id`: Delete a task.
- Store task data in memory (e.g., an array of objects) for simplicity. No need for a database setup for this interview task.
- Implement basic error handling for API endpoints (e.g., return 404 if task not found).

#### 3. Integration
- Connect the Next.js frontend to the Node.js backend to perform all CRUD operations.
- Handle asynchronous operations (e.g., loading states, error messages during API calls).

## Challenges & Bonus Points

#### Challenge 1: Frontend State Management
- Implement a robust state management solution for the frontend (e.g., React Context API, Zustand, or a simple custom hook) to manage tasks globally without prop drilling.

#### Challenge 2: UI/UX Enhancements
- Add a visual indicator for task status (e.g., different background colors, icons).
- Allow users to toggle task completion status directly from the list view.
- Implement a simple loading spinner or message when fetching data.

#### Challenge 3: Backend Persistence (Optional but Recommended)
- Instead of in-memory storage, persist tasks to a simple JSON file on the server. This requires reading from and writing to the file system.

#### Challenge 4: Filtering/Sorting (Bonus)
- Add functionality to filter tasks by status (e.g., show only "Pending" or "Completed" tasks).
- Add functionality to sort tasks (e.g., by creation date, title).

#### Challenge 5: Basic Authentication (Advanced Bonus)
- Implement a very basic, in-memory user authentication (e.g., a hardcoded username/password). Only authenticated users can perform CRUD operations. This would involve adding a login page and protecting API routes.

## Technical Constraints & Guidelines:

- Use `create-next-app` to set up the Next.js project.
- Use `express` or a similar lightweight framework for the Node.js backend.
- Organize your code logically with clear separation of concerns (e.g., components, API routes, utility functions).
- Write clean, readable, and well-commented code.
- Do not use any full-fledged database (like MongoDB, PostgreSQL) unless you choose to tackle Challenge 3 with a file-based approach.
- No need for complex deployment setups; focus on local development.

## Deliverables:

- A runnable Next.js project with the Node.js backend.
- Clear instructions on how to set up and run the application locally.
