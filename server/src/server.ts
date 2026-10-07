import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import adminRoutes from './routes/adminRoutes';
import { setupSocketHandlers } from './sockets/socketManager';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'theft_game';

// Socket.IO configuration with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);

// System Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    game: 'THEFT: Police & Undercover',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Static Client Serving (for unified production deployment)
const clientBuildPath = path.join(__dirname, '../../client/dist');
const fallbackStaticPath = path.join(__dirname, '../../');

app.use(express.static(clientBuildPath));
app.use(express.static(fallbackStaticPath));

app.get('*', (req, res) => {
  // Try client dist first, then root index.html
  const distIndex = path.join(clientBuildPath, 'index.html');
  const rootIndex = path.join(fallbackStaticPath, 'index.html');
  res.sendFile(distIndex, (err) => {
    if (err) res.sendFile(rootIndex);
  });
});

// Socket.IO Setup
setupSocketHandlers(io);

// MongoDB Atlas Connection
async function connectDatabase() {
  if (!MONGODB_URI) {
    console.log('[MongoDB] Notice: MONGODB_URI not set. Running with In-Memory game store.');
    return;
  }

  try {
    console.log('[MongoDB] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000
    });
    console.log('[MongoDB] Successfully connected to database:', DB_NAME);
  } catch (err: any) {
    console.warn('[MongoDB] Connection note:', err.message);
    console.log('[MongoDB] In-Memory game store active for seamless gameplay.');
  }
}

// Start Server
server.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`  THEFT: Police & Undercover - Real-Time Game Server   `);
  console.log(`  Running on: http://localhost:${PORT}                 `);
  console.log(`=======================================================`);
  await connectDatabase();
});

export { app, server, io };
