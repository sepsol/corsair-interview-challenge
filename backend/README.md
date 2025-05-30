# Task Manager Backend

This is a TypeScript Express.js backend API for the Task Manager application.

## Getting Started

First, install the dependencies:

```bash
npm install
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

### Tasks (Coming Soon)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Development

The project uses:
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing
- **tsx** - TypeScript execution for development

## Project Structure

```
src/
├── app.ts          # Main application entry point
├── routes/         # API route handlers
├── middleware/     # Custom middleware
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```