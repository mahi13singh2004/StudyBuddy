import StudyRoom from "../models/studyRoom.model.js";
import { generateRoomId } from "../utils/helpers.js";

export const createRoom = async (req, res) => {
    try {
        const { roomName } = req.body;
        const userId = req.user._id;
        const username = req.user.name;

        if (!roomName) {
            return res.status(400).json({ error: "Room name is required" });
        }

        const roomId = generateRoomId();

        const newRoom = new StudyRoom({
            roomId,
            roomName,
            createdBy: userId,
            participants: [{
                userId,
                username,
                joinedAt: new Date()
            }]
        });

        await newRoom.save();

        res.status(201).json({
            success: true,
            room: {
                roomId: newRoom.roomId,
                roomName: newRoom.roomName,
                participants: newRoom.participants,
                createdAt: newRoom.createdAt
            }
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;
        const username = req.user.name;

        const room = await StudyRoom.findOne({ roomId, isActive: true });

        if (!room) {
            return res.status(404).json({ error: "Room not found or inactive" });
        }

        // Check if user is already in the room
        const existingParticipant = room.participants.find(
            p => p.userId.toString() === userId.toString()
        );

        if (existingParticipant) {
            return res.status(200).json({
                success: true,
                message: "Already in room",
                room: {
                    roomId: room.roomId,
                    roomName: room.roomName,
                    participants: room.participants,
                    messages: room.messages.slice(-50) // Last 50 messages
                }
            });
        }

        // Check room capacity
        if (room.participants.length >= room.maxParticipants) {
            return res.status(400).json({ error: "Room is full" });
        }

        // Add user to room
        room.participants.push({
            userId,
            username,
            joinedAt: new Date()
        });

        await room.save();

        res.status(200).json({
            success: true,
            message: "Joined room successfully",
            room: {
                roomId: room.roomId,
                roomName: room.roomName,
                participants: room.participants,
                messages: room.messages.slice(-50)
            }
        });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await StudyRoom.findOne({ roomId, isActive: true });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.status(200).json({
            success: true,
            room: {
                roomId: room.roomId,
                roomName: room.roomName,
                participants: room.participants,
                messages: room.messages.slice(-50),
                createdAt: room.createdAt
            }
        });
    } catch (error) {
        console.error("Error getting room details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getActiveRooms = async (req, res) => {
    try {
        const rooms = await StudyRoom.find({ isActive: true })
            .select('roomId roomName participants createdAt')
            .sort({ createdAt: -1 })
            .limit(20);

        const roomsWithCount = rooms.map(room => ({
            roomId: room.roomId,
            roomName: room.roomName,
            participantCount: room.participants.length,
            createdAt: room.createdAt
        }));

        res.status(200).json({
            success: true,
            rooms: roomsWithCount
        });
    } catch (error) {
        console.error("Error getting active rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};