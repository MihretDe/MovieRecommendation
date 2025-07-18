"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieController_1 = require("../Controllers/movieController");
const router = (0, express_1.Router)();
router.post("/", movieController_1.saveMovie);
router.get("/", movieController_1.getMoviesByMood);
router.get("/:id", movieController_1.getMovieById);
exports.default = router;
