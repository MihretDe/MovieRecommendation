"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authroutes_1 = __importDefault(require("../src/routes/authroutes")); // Adjust the path as necessary
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authroutes_1.default);
// Connect to MongoDB and start server
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
