import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  movieId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  runtime: number;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  trailerKey: string;
  genres: mongoose.Types.ObjectId[];
  moods: mongoose.Types.ObjectId[];
}

const MovieSchema: Schema = new Schema({
  movieId: { type: Number, unique: true },
  title: String,
  originalTitle: String,
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: String,
  runtime: Number,
  popularity: Number,
  voteAverage: Number,
  voteCount: Number,
  trailerKey: String,
  genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  moods: [{ type: Schema.Types.ObjectId, ref: "Mood" }], // ✅ New field
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
