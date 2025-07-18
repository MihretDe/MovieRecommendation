"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieById = exports.getMoviesByMood = exports.saveMovie = void 0;
const Movie_1 = __importDefault(require("../models/Movie"));
const genreToMoodMapper_1 = require("../utils/genreToMoodMapper");
const Mood_1 = __importDefault(require("../models/Mood"));
const saveMovie = async (req, res) => {
    try {
        const { movieId, title, originalTitle, overview, posterPath, backdropPath, releaseDate, runtime, popularity, voteAverage, voteCount, trailerKey, genres, } = req.body;
        const exists = await Movie_1.default.findOne({ movieId });
        if (exists)
            return res.status(200).json({ message: "Already exists" });
        // ✅ Map to mood ObjectIds
        const genreIds = req.body.tmdbGenreIds;
        const moodIds = await (0, genreToMoodMapper_1.mapGenresToMoodIds)(genreIds);
        const newMovie = new Movie_1.default({
            movieId,
            title,
            originalTitle,
            overview,
            posterPath,
            backdropPath,
            releaseDate,
            runtime,
            popularity,
            voteAverage,
            voteCount,
            trailerKey,
            genres,
            moods: moodIds,
        });
        await newMovie.save();
        res.status(201).json({ message: "Movie saved to database." });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.saveMovie = saveMovie;
const getMoviesByMood = async (req, res) => {
    try {
        const moodQuery = req.query.mood;
        if (moodQuery) {
            const mood = await Mood_1.default.findOne({ name: moodQuery.toLowerCase() });
            if (!mood)
                return res.status(404).json({ message: "Mood not found" });
            const movies = await Movie_1.default.find({ moods: mood._id }).populate("genres moods");
            return res.json(movies);
        }
        const allMovies = await Movie_1.default.find().populate("genres moods");
        res.json(allMovies);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMoviesByMood = getMoviesByMood;
const getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie_1.default.findOne({ movieId }).populate("genres moods");
        if (!movie)
            return res.status(404).json({ message: "Movie not found" });
        res.json(movie);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMovieById = getMovieById;
