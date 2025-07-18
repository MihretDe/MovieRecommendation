"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const Movie_1 = __importDefault(require("../models/Movie"));
const genreToMoodMapper_1 = require("../utils/genreToMoodMapper");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const API_TOKEN = process.env.TMDB_TOKEN;
const API_URL = "https://api.themoviedb.org/3/movie/popular?page=1";
const headers = {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
};
const seedMovies = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("🔌 Connected to MongoDB");
        for (let page = 1; page <= 10; page++) {
            const response = await (0, node_fetch_1.default)(`https://api.themoviedb.org/3/movie/popular?page=${page}`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });
            const data = (await response.json());
            const movies = data.results;
            for (const movie of movies) {
                const exists = await Movie_1.default.findOne({ movieId: movie.id });
                if (exists)
                    continue;
                const moodIds = await (0, genreToMoodMapper_1.mapGenresToMoodIds)(movie.genre_ids);
                if (moodIds.length === 0)
                    continue;
                await Movie_1.default.create({
                    movieId: movie.id,
                    title: movie.title,
                    originalTitle: movie.original_title,
                    overview: movie.overview,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    releaseDate: movie.release_date,
                    runtime: 0, // You can fetch details to fill this if needed
                    popularity: movie.popularity,
                    voteAverage: movie.vote_average,
                    voteCount: movie.vote_count,
                    trailerKey: movie.trailerKey,
                    genres: movie.genre_ids,
                    moods: moodIds,
                });
                console.log(`✅ Saved: ${movie.title}`);
            }
            console.log("🎉 Movie seeding complete!");
            process.exit(0);
        }
        ;
    }
    catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};
seedMovies();
