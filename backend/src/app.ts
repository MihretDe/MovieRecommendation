import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import movieRoutes from "./routes/movies";
import moodRoutes from "./routes/moods";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
import authRoutes from "./routes/auth";
app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);

export default app;
