import { model, Schema } from "mongoose";

export interface UserType {
  name: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: Date;
  image: string;
  role: string;
  deviceToken: string;
}
const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ["Male", "Female"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["Admin", "User"],
    },
    deviceToken: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<UserType>("User", userSchema);
