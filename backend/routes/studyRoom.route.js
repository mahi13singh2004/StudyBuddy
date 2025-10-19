import express from "express";
import {
    createRoom,
    joinRoom,
    getRoomDetails,
    getActiveRooms
} from "../controllers/studyRoom.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createRoom);
router.post("/join/:roomId", protectRoute, joinRoom);
router.get("/:roomId", protectRoute, getRoomDetails);
router.get("/", protectRoute, getActiveRooms);

export default router;