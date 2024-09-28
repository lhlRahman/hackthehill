// ./routes/mission.js
import express from "express";
import * as missionControllers from "../controllers/mission.js";
import authMiddleware from "../utils/auth.js";

const missionRouter = express.Router();

missionRouter.post("/", authMiddleware, missionControllers.createMission);
missionRouter.get("/", authMiddleware, missionControllers.getMissions);
missionRouter.put("/:id", authMiddleware, missionControllers.editMission);
missionRouter.delete("/:id", authMiddleware, missionControllers.deleteMission);
missionRouter.post("/check", authMiddleware, missionControllers.checkMissions);

export default missionRouter;
