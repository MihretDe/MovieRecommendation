import mongoose, { Schema, Document } from "mongoose";

export interface IGenre extends Document {
  genreId: number;
  name: string;
}

const GenreSchema: Schema = new Schema({
  genreId: { type: Number, required: true },
  name: { type: String, required: true },
});

export const Genre = mongoose.models.Genre || mongoose.model<IGenre>("Genre", GenreSchema);

export default Genre;