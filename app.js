import express from 'express';
import 'dotenv/config.js'
import morgan from 'morgan';
import connect from './db/db.js';
import projectsRoutes from './routes/project.routes.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import aiRoute from './routes/AI.routes.js';

connect();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    'http://localhost:4173', // Vite preview
    'https://your-frontend-domain.com', // Replace with your actual frontend domain
    'https://chat2code-frontend.onrender.com' // If you deploy frontend to Render
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/projects', projectsRoutes);
app.use('/users', userRouter);
app.use('/ai',aiRoute)

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello from AI Chat App Backend!');
});

export default app;