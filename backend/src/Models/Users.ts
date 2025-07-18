import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  auth0Id: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  auth0Id: { type: String, required: true, unique: true },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
