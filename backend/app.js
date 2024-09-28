// ./app.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "express-async-errors";
import dotenv from "dotenv";
import { unknownEndpoint, errorHandler } from "./utils/middleware.js";
import missionRouter from "./routes/mission.js";
import userRouter from "./routes/user.js";
import https from "https";
import textTo3DRoutes from "./routes/textTo3D.js"

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
app.use('/api', textTo3DRoutes);

app.get("/health", (req, res, next) => {
    res.sendStatus(200);

    console.log("sent request to myself");    
});

// Error handling middleware
app.use(unknownEndpoint);
app.use(errorHandler);

startServer();

function makeRequest() {
    https.get('https://hackthehill.onrender.com/health', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            console.log("sent request to myself");
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

// Request every 15 mins
setInterval(makeRequest, 15 * 20 * 1000);

export default app;
