// server.js

import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import projectmodel from './models/project.model.js';
import mongoose from 'mongoose';
import { generateResult } from './services/Gemini.services.js';
import connect from './db/db.js';

dotenv.config();
const port = process.env.PORT  || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// ✅ SOCKET.IO MIDDLEWARE WITH NULL CHECKS
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(' ')[1];
    const projectId = socket.handshake.query.projectId;

    console.log(`🔍 Incoming connection with projectId: ${projectId}`);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error('❌ Invalid Project ID'));
    }

    const project = await projectmodel.findById(projectId);
    if (!project) {
      return next(new Error(`❌ Project not found for ID: ${projectId}`));
    }

    if (!token) {
      return next(new Error('❌ No Token Found, Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error('❌ Invalid Token'));
    }

    socket.project = project; // ✅ Safe!
    socket.user = decoded;

    next();
  } catch (error) {
    console.error('🔥 Error in socket middleware:', error);
    next(error);
  }
});

// ✅ SOCKET CONNECTION
io.on('connection', socket => {
  socket.roomId = socket.project._id.toString();
  console.log(`🟢 New client connected to room: ${socket.roomId}`);
  socket.join(socket.roomId);

  socket.on('project-message', async data => {
    const message = data.message || '';
    console.log(`💬 Received: ${message}`);

    const AipresentInMsg = message.includes('@Ai') || message.includes('@ai') || message.includes('@AI');
    socket.broadcast.to(socket.roomId).emit('project-message', data);

    if (AipresentInMsg) {
      const prompt = message.replace(/@Ai|@ai|@AI/g, '').trim();
      const result = await generateResult(prompt);
      io.to(socket.roomId).emit('project-message', {
        message: result,
        sender: {
          id: 'ai',
          email: 'Sachi AI'
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected from room: ${socket.roomId}`);
    socket.leave(socket.roomId);
  });
});

// ✅ CONNECT TO DB + START SERVER
const startServer = async () => {
  try {
    await connect();
    server.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
