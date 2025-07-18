import { Request, Response } from "express";
import Movie from "../Models/Movie";
import { mapGenresToMoodIds } from "../utils/genreToMoodMapper";
import Mood from "../Models/Mood";

export const saveMovie = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    const exists = await Movie.findOne({ movieId });
    if (exists) return res.status(200).json({ message: "Already exists" });

    // ✅ Map to mood ObjectIds
    const genreIds = req.body.tmdbGenreIds as number[];
    const moodIds = await mapGenresToMoodIds(genreIds);

    const newMovie = new Movie({
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
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getMoviesByMood = async (req: Request, res: Response) => {
  try {
    const moodQuery = req.query.mood as string;

    if (moodQuery) {
      const mood = await Mood.findOne({ name: moodQuery.toLowerCase() });
      if (!mood) return res.status(404).json({ message: "Mood not found" });

      const movies = await Movie.find({ moods: mood._id }).populate(
        "genres moods"
      );
      return res.json(movies);
    }

    const allMovies = await Movie.find().populate("genres moods");
    res.json(allMovies);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
