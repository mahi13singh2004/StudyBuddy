import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";
import folderRoutes from "./routes/folder.route.js";
import aiRoutes from "./routes/ai.route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
