// ./routes/user.js
import express from "express";
import * as userControllers from "../controllers/user.js";
import authMiddleware from "../utils/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userControllers.registerUser);
userRouter.post("/login", userControllers.loginUser);
userRouter.get("/balance", userControllers.getBalance);
userRouter.get("/friends", userControllers.getFriends);
userRouter.post("/add-friend", userControllers.addFriend);
userRouter.put("/updatepoints", userControllers.updateBalance);

export default userRouter;
