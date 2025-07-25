"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../Controllers/authController");
const router = (0, express_1.Router)();
router.post("/signup", authController_1.signup);
router.post("/login", authController_1.login);
router.get("/me", authController_1.fetchMe);
exports.default = router;
