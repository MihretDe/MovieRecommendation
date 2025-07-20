import { Router } from "express";
import { getAllMoods } from "../Controllers/moodController";

const router = Router();

router.get("/", getAllMoods);

export default router;
