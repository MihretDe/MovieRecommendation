import { getAllMoods } from "../Controllers/moodController";
import { Router } from "express";

const router = Router();

router.get("/", getAllMoods);

export default router;