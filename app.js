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
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,  origin: ['aichatapp-phi.vercel.app', 'http://localhost:5173']
}));

app.use('/projects', projectsRoutes);
app.use('/users', userRouter);
app.use('/ai',aiRoute)

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hell');
});

export default app;