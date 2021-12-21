const express = require("express");
const router = express.Router();

const Movie = require("../models/Movie");
const movieFromOMDb = require("./omdb");
const authenticate = require("../middleware/authenticate");
const checkForLimit = require("../middleware/checkForLimit");

require("dotenv").config();

router.get("/", authenticate, async (req, res) => {
  try {
    const movies = await Movie.find({ userID: res.locals.userId });
    res.send({
      movies: movies.map((movie) =>
        (({ userId, __v, createdAt, updatedAt, ...movieInfo }) => movieInfo)(
          movie.toJSON()
        )
      ),
    });
  } catch (err) {
    console.error(`Error fetching movies: ${err.message}`);
    res.send(500).send({ message: "Error occurred" });
  }
});

router.post("/", authenticate, checkForLimit, async (req, res) => {
  try {
    if (!process.env.OMDB_TOKEN)
      return res.status(500).send({ message: `OMDB TOKEN are not provided` });

    const movieExist = await Movie.exists({
      title: req.body.title,
      userID: res.locals.userId,
    });

    if (!req.body.title)
      return res.status(400).send({ message: `Title is empty` });

    if (movieExist)
      return res
        .status(409)
        .send({ message: `Title ${req.body.title} already exist in database` });

    const dataFromApi = await movieFromOMDb(encodeURI(req.body.title));
    if (dataFromApi["Response"] == "False")
      return res.status(404).send({ message: dataFromApi["Error"] });

    var new_user = new Movie({
      title: dataFromApi["Title"],
      released: dataFromApi["Released"],
      genre: dataFromApi["Genre"],
      director: dataFromApi["Director"],
      userID: res.locals.userId,
    });

    new_user.save(function (err, result) {
      if (err) {
        console.error(`Error with saving movie: ${err.message}`);
        return res.status(500).send({ message: "Error occurred" });
      }
    });

    res.send(new_user);
  } catch (error) {
    console.error(`Error with creating movie: ${err.message}`);
    return res.status(500).send({ message: "Error occurred" });
  }
});

module.exports = router;
