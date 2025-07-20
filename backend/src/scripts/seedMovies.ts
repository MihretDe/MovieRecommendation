import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import Movie from "../Models/Movie";
import { mapGenresToMoodIds } from "../utils/genreToMoodMapper";
import Genre from "../Models/Genre";

dotenv.config();

const API_TOKEN = process.env.TMDB_API_TOKEN;


const headers = {
  accept: "application/json",
  Authorization: `Bearer ${API_TOKEN}`,
};

interface TMDbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  popularity: number;
  vote_average: number;
  trailerKey: string;
  vote_count: number;
  genre_ids: number[];
}

interface TMDbResponse {
  results: TMDbMovie[];
}

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("🔌 Connected to MongoDB");

    for (let page = 1; page <= 50; page++) {
      console.log(`📄 Fetching page ${page}`);
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?page=${page}`,
        { headers }
      );

      const data = (await response.json()) as Partial<TMDbResponse>;

      if (!data.results || !Array.isArray(data.results)) {
        console.error(`❌ Invalid data on page ${page}:`, data);
        continue;
      }

      const movies = data.results;

      for (const movie of movies) {
        const exists = await Movie.findOne({ movieId: movie.id });
        if (exists) continue;

        const moodIds = await mapGenresToMoodIds(movie.genre_ids ?? []);
        if (moodIds.length === 0) continue;

        const genreDocs = await Genre.find({
          genreId: { $in: movie.genre_ids },
        });

        const genreObjectIds = genreDocs.map((g) => g._id);

        await Movie.create({
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
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};


seedMovies();
