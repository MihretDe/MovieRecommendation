"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGenresToMoodIds = void 0;
const Mood_1 = __importDefault(require("../models/Mood"));
// genre ID → mood name
const genreToMood = {
    28: "excited", // Action
    12: "excited", // Adventure
    16: "nostalgic", // Animation
    35: "happy", // Comedy
    80: "scared", // Crime
    99: "relaxed", // Documentary
    18: "sad", // Drama
    10751: "happy", // Family
    14: "excited", // Fantasy
    36: "nostalgic", // History
    27: "scared", // Horror
    10402: "happy", // Music
    9648: "scared", // Mystery
    10749: "romantic", // Romance
    878: "excited", // Sci-Fi
    10770: "relaxed", // TV Movie
    53: "scared", // Thriller
    10752: "sad", // War
    37: "nostalgic", // Western
};
const mapGenresToMoodIds = async (genreIds) => {
    const moods = await Mood_1.default.find({});
    const moodIds = new Set();
    for (const genreId of genreIds) {
        const moodName = genreToMood[genreId];
        if (!moodName)
            continue;
        const mood = moods.find((m) => m.name.toLowerCase() === moodName);
        if (mood)
            moodIds.add(mood._id.toString());
    }
    return Array.from(moodIds);
};
exports.mapGenresToMoodIds = mapGenresToMoodIds;
