# Task Manager Backend

This is a TypeScript Express.js backend API for the Task Manager application with JWT authentication and comprehensive task management.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your environment variables by copying `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then, run the development server:

```bash
npm run dev
```

The server will start on [http://localhost:4000](http://localhost:4000).

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript project for production
- `npm start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

## API Endpoints

### Health Check
- `GET /` - Basic API status message
- `GET /health` - Health check endpoint with timestamp

### Authentication
- `POST /api/auth/register` - Register a new user
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Returns: JWT token and user information
- `POST /api/auth/login` - Authenticate user
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: JWT token and user information

### Tasks (Protected Routes)
All task endpoints require a valid JWT token in the Authorization header: `Bearer <token>`

- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
  - Body: `{ "title": "string", "description": "string", "status": "pending|in-progress|completed" }`
- `PUT /api/tasks/:id` - Update a task
  - Body: `{ "title": "string", "description": "string", "status": "pending|in-progress|completed" }`
- `DELETE /api/tasks/:id` - Delete a task

## Authentication

This API uses JWT (JSON Web Tokens) for authentication:

1. **Register** or **Login** to receive a JWT token
2. Include the token in the `Authorization` header: `Bearer <your-token>`
3. The token expires after 24 hours by default
4. Passwords are hashed using bcrypt for security

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=development
PORT=4000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

## Technology Stack

- **Express.js** - Web framework with ES modules
- **TypeScript** - Type safety and modern JavaScript features
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing
- **tsx** - TypeScript execution for development
- **dotenv** - Environment variable management

## Data Storage

Currently using in-memory storage for:
- **Users**: Stored in `src/data/users.ts`
- **Tasks**: Stored in `src/data/tasks.ts`

## Project Structure

```
src/
├── app.ts              # Main application entry point
├── config/
│   └── env.ts          # Environment configuration
├── data/
│   ├── tasks.ts        # Task data storage
│   └── users.ts        # User data storage
├── middleware/
│   ├── auth.ts         # JWT authentication middleware
│   └── delay.ts        # Development delay middleware
├── routes/
│   ├── auth.ts         # Authentication routes
│   └── tasks.ts        # Task management routes
├── types/
│   └── api.ts          # API type definitions
└── utils/              # Utility functions
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Task endpoints require valid authentication
- **Input Validation**: Request validation for all endpoints
- **CORS Configuration**: Proper cross-origin setup for frontend integration