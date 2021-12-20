const mongoose = require("mongoose");

const MovieSchema = mongoose.Schema(
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

module.exports = mongoose.model("Movie", MovieSchema);
