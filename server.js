import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import express from 'express';
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import taskRoutes from './routes/taskRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from "./routes/leaveRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import documentRoutes   from  "./routes/documentRoutes.js";
import adminRoutes from './routes/admin.js'
import cors from "cors"
import cookieParser from 'cookie-parser';



const app = express();
connectDB();

//  Middleware to parse JSON 
app.use(express.json());

const allowedOrigins = 'http://localhost:5173'; // Frontend URL

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser())

// Routes
app.use("/api/users", userRoutes);          // User Routes
app.use("/api/employee", employeeRoutes);   // Employee Routes
app.use('/api/task', taskRoutes);        // Task Routes
app.use('/api/attendance', attendanceRoutes); // Attendance Routes
app.use("/api/leaves", leaveRoutes);      // Leave Routes
app.use("/api/achievements", achievementRoutes); //achievements
app.use("/uploads", express.static("uploads"));   // Serve uploaded files statically (optional)
app.use("/api/documents", documentRoutes);    // documents routes
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
