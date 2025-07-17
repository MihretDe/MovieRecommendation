import { Router } from "express";
import { getMoviesByMood } from "../controllers/movieController";

const router = Router();

router.get("/", getMoviesByMood);

export default router;
