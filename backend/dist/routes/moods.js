"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moodController_1 = require("../Controllers/moodController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", moodController_1.getAllMoods);
exports.default = router;
