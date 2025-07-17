import mongoose, { Schema, Document } from "mongoose";

export interface IMood extends Document {
  name: string;
  genreIds: number[];
}

const MoodSchema: Schema = new Schema({
  name: { type: String, required: true },
  genreIds: [Number],
});

export default mongoose.model<IMood>("Mood", MoodSchema);
