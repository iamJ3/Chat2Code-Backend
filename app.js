import express from 'express';
import 'dotenv/config.js'
import morgan from 'morgan';
import connect from './db/db.js';
import projectsRoutes from './routes/project.routes.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
connect();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/projects', projectsRoutes);
app.use('/users', userRouter);
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hell');
});

export default app;