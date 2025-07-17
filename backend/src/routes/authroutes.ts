// src/routes/authRoutes.ts
import express from 'express';
import { signup } from "../Controllers/authController"

const router = express.Router();

router.post('/signup', signup);

export default router;
