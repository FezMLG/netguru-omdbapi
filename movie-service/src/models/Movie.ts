import * as mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const MovieSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    released: {
      type: String,
    },
    genre: {
      type: String,
    },
    director: {
      type: String,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movie", MovieSchema);
