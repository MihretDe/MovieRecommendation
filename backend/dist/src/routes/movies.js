"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieController_1 = require("../controllers/movieController");
const router = (0, express_1.Router)();
router.get("/", movieController_1.getMoviesByMood);
exports.default = router;
