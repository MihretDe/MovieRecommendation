import { Router } from "express";
import { getMovieById, getMoviesByMood, saveMovie } from "../Controllers/movieController";

const router = Router();
router.post("/", saveMovie);
router.get("/", getMoviesByMood);
router.get("/:id", getMovieById);

export default router;
