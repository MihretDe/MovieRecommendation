import mongoose, { Schema, Document } from "mongoose";

export interface IGenre extends Document {
  genreId: number;
  name: string;
}

const GenreSchema: Schema = new Schema({
  genreId: { type: Number, required: true },
  name: { type: String, required: true },
});

export default mongoose.model<IGenre>("Genre", GenreSchema);
