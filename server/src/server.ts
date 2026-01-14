import express from 'express';
import type { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

// 1. Import your Routes 
import roomRoutes from './Routes/Roomroute.ts';
// NEW: Import the Auth Routes we just discussed
import authRoutes from './Routes/AuthRoute.ts'; 

// 2. Configuration
dotenv.config();
const app: Application = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// 3. Real-time Engine (Socket.io)
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// 4. Global Middleware
app.use(cors());
app.use(express.json());

// 5. Connect the Routes
// Existing room logic
app.use('/api/rooms', roomRoutes);

// NEW: Connect Auth logic (This enables /api/auth/register and /api/auth/login)
app.use('/api/auth', authRoutes);

// 6. Basic Health Check
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: "online", 
    message: "LuxeAI Enterprise Server v1.0",
    db_status: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// 7. Database Connection & Server Start
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in your .env file!");
    }

    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected Successfully (Local)');

    server.listen(PORT, () => {
      console.log(`🚀 LuxeAI Server live at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// 8. Real-time Logic
io.on('connection', (socket: Socket) => {
  console.log('⚡ New Client Connected:', socket.id);
});

// START
startServer();