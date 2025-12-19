
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from "./DB/db.js";
import route from './Routes/todoRoutes.js';
import authRoutes from './Routes/authRoutes.js';
import { seedAdmin } from './Controller/authController.js';

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express();

app.use(cors({
   origin: '*', // Allow all origins (for now, to fix connection issues)
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', route);
app.use('/api/auth', authRoutes);

// Start server after database connection
const startServer = async () => {
   try {
      await connectDb();
      await seedAdmin(); // Seed admin user
      app.listen(PORT, () => {
         console.log(`Server running on http://localhost:${PORT}`);
      });
   } catch (error) {
      console.error('Failed to start server:', error);
   }
}

startServer();