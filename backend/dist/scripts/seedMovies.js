"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const Movie_1 = __importDefault(require("../Models/Movie"));
const genreToMoodMapper_1 = require("../utils/genreToMoodMapper");
const Genre_1 = __importDefault(require("../Models/Genre"));
dotenv_1.default.config();
const API_TOKEN = process.env.TMDB_API_TOKEN;
const headers = {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
};
const seedMovies = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("🔌 Connected to MongoDB");
        for (let page = 1; page <= 50; page++) {
            console.log(`📄 Fetching page ${page}`);
            const response = await (0, node_fetch_1.default)(`https://api.themoviedb.org/3/movie/popular?page=${page}`, { headers });
            const data = (await response.json());
            if (!data.results || !Array.isArray(data.results)) {
                console.error(`❌ Invalid data on page ${page}:`, data);
                continue;
            }
            const movies = data.results;
            for (const movie of movies) {
                const exists = await Movie_1.default.findOne({ movieId: movie.id });
                if (exists)
                    continue;
                const moodIds = await (0, genreToMoodMapper_1.mapGenresToMoodIds)(movie.genre_ids ?? []);
                if (moodIds.length === 0)
                    continue;
                const genreDocs = await Genre_1.default.find({
                    genreId: { $in: movie.genre_ids },
                });
                const genreObjectIds = genreDocs.map((g) => g._id);
                await Movie_1.default.create({
                    movieId: movie.id,
                    title: movie.title,
                    originalTitle: movie.original_title,
                    overview: movie.overview,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                    releaseDate: movie.release_date,
                    runtime: 0,
                    popularity: movie.popularity,
                    voteAverage: movie.vote_average,
                    voteCount: movie.vote_count,
                    trailerKey: movie.trailerKey,
                    genres: genreObjectIds,
                    moods: moodIds,
                });
                console.log(`✅ Saved: ${movie.title}`);
            }
        }
        console.log("🎉 Movie seeding complete!");
        process.exit(0); // ✅ OUTSIDE the loop
    }
    catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};
seedMovies();
