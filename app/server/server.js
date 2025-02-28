import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as authRoutes from './routes/authRoutes.js';
import * as resourceRoutes from './routes/resourceRoutes.js';
import * as chatRoutes from './routes/chatRoutes.js';
import * as errorMiddleware from './middlewares/error.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
require('./config/db')();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/chat', chatRoutes);

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});