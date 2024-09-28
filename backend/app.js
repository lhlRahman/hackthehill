// ./app.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "express-async-errors";
import dotenv from "dotenv";
import { unknownEndpoint, errorHandler } from "./utils/middleware.js";
import missionRouter from "./routes/mission.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();

// Database connection
const db_url = process.env.MONGODB_URI;
console.log("Connecting to", db_url);

const startServer = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
  
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  };
  
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));

// Routes
app.use("/mission", missionRouter);
app.use("/user", userRouter);

// Error handling middleware
app.use(unknownEndpoint);
app.use(errorHandler);

startServer();

export default app;
