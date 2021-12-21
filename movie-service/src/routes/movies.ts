import { Router } from "express";
const router = Router();

import Movie from "../models/Movie";
import movieFromOMDb from "./omdb";
import authenticate from "../middleware/authenticate";
import checkForLimit from "../middleware/checkForLimit";

require("dotenv").config();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - Title
 *         - UserID
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         Title:
 *           type: string
 *           description: The movie title
 *         Released:
 *           type: date
 *           description: The movie release date
 *         Genre:
 *           type: string
 *           description: The movie genre
 *         Director:
 *           type: string
 *           description: The movie author
 *         UserID:
 *           type: string
 *           description: ID of the user that added this movie
 *         createdAt:
 *           type: date
 *           description: Date that the movie was created by the user (ms)
 *       example:
 *         id: qwerty
 *         title: Example title
 *         released: 1639661479674
 *         genre: Example genre
 *         director: Example director
 *         userID: Example user
 *         createdAt: 1639676666395
 */

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: The movies managing API
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Returns the list of all the movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: The list of the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */

router.get("/", authenticate, async (req, res) => {
  try {
    const movies = await Movie.find({ userID: res.locals.userId });
    res.send({
      movies: movies.map((movie: any) =>
        (({ userId, __v, createdAt, updatedAt, ...movieInfo }) => movieInfo)(
          movie.toJSON()
        )
      ),
    });
  } catch (err: any) {
    console.error(`Error fetching movies: ${err.message}`);
    res.send(500).send({ message: "Error occurred" });
  }
});

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: The movie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Some server error
 */

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

    new_user.save(function (err: { message: any; }, result: any) {
      if (err) {
        console.error(`Error with saving movie: ${err.message}`);
        return res.status(500).send({ message: "Error occurred" });
      }
    });

    res.send(new_user);
  } catch (error: any) {
    console.error(`Error with creating movie: ${error.message}`);
    return res.status(500).send({ message: "Error occurred" });
  }
});

export default router;
