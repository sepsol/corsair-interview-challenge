# Task Manager Frontend

This is a modern Next.js 15 application built with TypeScript and Tailwind CSS for the Task Manager project. It provides a responsive, user-friendly interface for managing tasks with authentication.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your environment variables by copying `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint for code quality

## Features

### Authentication
- **User Registration**: Create new user accounts with email/password
- **User Login**: Secure authentication with JWT tokens
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Management**: Persistent login state across browser sessions

### Task Management
- **Create Tasks**: Add new tasks with title, description, and status
- **View Tasks**: Display all tasks in an organized, responsive layout
- **Edit Tasks**: Update task details inline with form validation
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Task Status**: Track tasks as pending, in-progress, or completed
- **Real-time Updates**: Immediate UI updates after task operations

### User Experience
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Comprehensive error messages and recovery
- **Form Validation**: Real-time validation with helpful error messages
- **Empty States**: Helpful guidance when no tasks exist
- **Confirmation Modals**: Prevent accidental deletions

## Technology Stack

- **Next.js 15** - React framework with App Router and Turbopack
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Hook Form** - Performant form handling with validation
- **Yup** - Schema validation for forms
- **Axios** - HTTP client for API communication
- **SASS** - CSS preprocessor for component styles

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home/login page
│   └── tasks/
│       └── page.tsx        # Tasks dashboard
├── components/
│   ├── TaskCard.tsx        # Individual task display
│   ├── TaskForm.tsx        # Task creation/editing form
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Checkbox.tsx
│       ├── ConfirmationModal.tsx
│       ├── EmptyState.tsx
│       ├── ErrorMessage.tsx
│       ├── FormField.tsx
│       ├── LoadingSpinner.tsx
│       ├── Modal.tsx
│       ├── PageLayout.tsx
│       ├── TextArea.tsx
│       └── TextInput.tsx
├── schemas/
│   └── taskSchema.ts       # Yup validation schemas
├── services/
│   └── api.ts              # API client and service functions
└── types/                  # TypeScript type definitions
```

## API Integration

The frontend communicates with the backend API through:

- **Authentication Service**: Login and registration endpoints
- **Task Service**: CRUD operations for task management
- **Error Handling**: Comprehensive error response handling
- **Token Management**: Automatic JWT token handling in requests

## Styling

- **Tailwind CSS**: Utility-first approach for consistent styling
- **Component Styling**: Modular SASS files for complex components
- **Responsive Design**: Mobile-first breakpoints and layouts
- **Design System**: Consistent colors, typography, and spacing
- **Dark Mode Ready**: CSS variables prepared for theme switching

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Development

The application uses:
- **App Router**: Next.js 13+ routing with layouts and nested routes
- **Server Components**: Optimized performance with RSC where possible
- **Client Components**: Interactive components with state management
- **TypeScript**: Strict type checking for reliability
- **ESLint**: Code quality and consistency enforcement

## Build and Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

The application is optimized for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.
