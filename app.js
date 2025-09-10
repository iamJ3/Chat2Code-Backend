import express from 'express';
import 'dotenv/config.js'
import morgan from 'morgan';
import connect from './db/db.js';
import projectsRoutes from './routes/project.routes.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import aiRoute from './routes/AI.routes.js';
import { checkDatabaseConnection, warnDatabaseConnection } from './middleware/db.middleware.js';
import { getConnectionStatus } from './db/db.js';

// Initialize database connection
connect();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://aichatapp-phi.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


// Apply database connection check to all routes that require database access
app.use('/projects', checkDatabaseConnection, projectsRoutes);
app.use('/users', checkDatabaseConnection, userRouter);
app.use('/ai', warnDatabaseConnection, aiRoute)

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('AI Chat App Backend is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  
  res.status(dbStatus.isConnected ? 200 : 503).json({
    success: dbStatus.isConnected,
    message: dbStatus.isConnected ? "Service is healthy" : "Database connection failed",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

export default app;