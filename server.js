// Starts the Express server and loads environment variables
import http from 'http';
import app from './app.js'
import dotenv from 'dotenv'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import projectmodel from './models/project.model.js';
import mongoose from 'mongoose';


dotenv.config();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('No Project ID Found, Authentication error'));
        }

        socket.project = await projectmodel.findById(projectId).lean()

        if (!token) {
            return next(new Error('No Token Found, Authentication error'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Invalid Token'));
        }
        socket.user = decoded;
        next();
    } catch (error) {
        console.error('Error in socket middleware:', error);
        next(error);
    }
});

io.on('connection', socket => {
    console.log('New client connected');
    socket.join(socket.project.id);
    
    socket.on('project-message', data => {
        console.log(data)
        socket.broadcast.to(socket.project.id).emit('project-message', data)
    })

    socket.on('event', data => { /* … */ });
    
    socket.on('disconnect', () => { /* … */ });

});







server.listen(port, () => {
    console.log(`server is ruuning at ${port}`);

})