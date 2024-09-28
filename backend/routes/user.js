// ./routes/user.js
import express from "express";
import * as userControllers from "../controllers/user.js";
import authMiddleware from "../utils/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userControllers.registerUser);
userRouter.post("/login", userControllers.loginUser);
userRouter.get("/balance", authMiddleware, userControllers.getBalance);

export default userRouter;
