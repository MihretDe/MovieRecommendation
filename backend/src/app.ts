import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
import movieRoutes from "./routes/movies";
app.use("/api/movies", movieRoutes);

export default app;
