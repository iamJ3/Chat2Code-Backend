// Starts the Express server and loads environment variables
import http from 'http';
import app from './app.js'
import dotenv from 'dotenv'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import projectmodel from './models/project.model.js';
import mongoose from 'mongoose';
import { generateResult } from './services/Gemini.services.js';


dotenv.config();
const port = process.env.PORT;

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

        socket.project = await projectmodel.findById(projectId);

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

    socket.roomId = socket.project._id.toString();
    console.log('New client connected');
    socket.join(socket.roomId);

    socket.on('project-message', async data => {
        const message = data.message;
        console.log("ai is present");

        const AipresentInMsg = message.includes('@Ai') || message.includes('@ai') || message.includes('@AI');
        socket.broadcast.to(socket.roomId).emit('project-message',data)
       
        if (AipresentInMsg) {
            const prompt = message.replace(/@Ai|@|@ai|@AI/g, '').trim();
            const result = await generateResult(prompt);
            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender:{
                    id:'ai',
                    email:"Sachi AI"
                }

            });
        }
    })

    socket.on('event', data => { /* … */ });

    socket.on('disconnect', () => { 
        console.log('user disconnected');
        socket.leave(socket.roomId)
        
       });

});







server.listen(port, () => {
    console.log(`server is ruuning at ${port}`);

})