# Corsair Interview Challenge
The take-home coding challenge from the Corsair technical interview.

## Task Manager Application

### Overview
A full-stack Task Manager application built with Next.js 15 (frontend) and Node.js/Express (backend) with TypeScript. Users can create, view, update, and delete tasks with user authentication.

For the full specification please see [here](./SPECIFICATION.md).

### Features
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Task Management**: Full CRUD operations for tasks with validation
- **Responsive Design**: Mobile-first design built with Tailwind CSS
- **Type Safety**: TypeScript across frontend, backend, and shared types
- **Real-time Validation**: Form validation using Yup and React Hook Form
- **Task Filtering**: Filter tasks by status and other criteria
- **Modern Stack**: Next.js 15 with Turbopack, Express.js with ES modules

### Technology Stack

#### Frontend
- **Next.js 15** with TypeScript and Turbopack
- **React 19** with React Hook Form for form management
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Yup** for schema validation

#### Backend
- **Express.js** with TypeScript and ES modules
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Morgan** for HTTP logging
- **CORS** for cross-origin requests

#### Shared
- **TypeScript types** shared between frontend and backend
- **Monorepo structure** with workspace dependencies

### Project Structure
```
├── frontend/          # Next.js React application
├── backend/           # Express.js API server
├── shared/            # Shared TypeScript types
├── SPECIFICATION.md   # Detailed project requirements
└── README.md         # This file
```

### Setup
1. Clone the repository
2. Navigate to the project's root directory
3. Install dependencies for all packages:
   ```sh
   npm install
   ```
4. Set up environment variables (copy `.env.example` files in backend and frontend)

### Development
Run both frontend and backend in development mode:

```sh
# Backend (runs on localhost:4000)
cd backend && npm run dev

# Frontend (runs on localhost:3000)
cd frontend && npm run dev
```

### Production
Build and run in production mode:

```sh
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start
```

### API Documentation
The backend provides REST API endpoints for:
- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Tasks**: `/api/tasks` (GET, POST, PUT, DELETE)
- **Health**: `/health` for monitoring

See individual README files in `backend/` and `frontend/` directories for more details.
