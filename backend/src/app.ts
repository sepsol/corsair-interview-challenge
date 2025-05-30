import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import tasksRouter from '@/routes/tasks';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/tasks', tasksRouter);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
