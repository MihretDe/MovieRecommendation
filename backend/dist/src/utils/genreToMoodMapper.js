"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGenresToMoodIds = void 0;
const Mood_1 = __importDefault(require("../Models/Mood"));
// Example mapping: TMDb Genre IDs → Mood Names
const genreMoodMap = {
    35: "happy", // Comedy
    18: "sad", // Drama
    28: "excited", // Action
    27: "scared", // Horror
    10749: "romantic",
    16: "nostalgic", // Animation
    99: "relaxed", // Documentary
};
const mapGenresToMoodIds = async (genreIds) => {
    const moods = await Mood_1.default.find({});
    const moodIds = new Set();
    for (const genreId of genreIds) {
        const moodName = genreMoodMap[genreId];
        if (!moodName)
            continue;
        const mood = moods.find((m) => m.name === moodName);
        if (mood)
            moodIds.add(mood._id.toString());
    }
    return Array.from(moodIds);
};
exports.mapGenresToMoodIds = mapGenresToMoodIds;
