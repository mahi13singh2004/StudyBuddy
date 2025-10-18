import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";
import folderRoutes from "./routes/folder.route.js";
import aiRoutes from "./routes/ai.route.js";
import pdfRoutes from "./routes/pdf.route.js";
import statRoutes from "./routes/stat.route.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://studybuddy-frontend-9meh.onrender.com",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/stats",statRoutes)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
