"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1)
        return;
    return mongoose_1.default.connect(MONGODB_URI, {
        dbName: 'your-db-name', // optional, or set via the URI itself
    });
};
exports.connectDB = connectDB;
