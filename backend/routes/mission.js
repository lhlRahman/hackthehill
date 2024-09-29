// ./routes/mission.js
import express from "express";
import * as missionControllers from "../controllers/mission.js";
import authMiddleware from "../utils/auth.js";

const missionRouter = express.Router();

missionRouter.post("/", missionControllers.createMission);
missionRouter.post("/getbyid",  missionControllers.getMissions);
missionRouter.put("/:id",  missionControllers.editMission);
missionRouter.delete("/:id" , missionControllers.deleteMission);
missionRouter.post("/check", missionControllers.checkMissions);


export default missionRouter;
