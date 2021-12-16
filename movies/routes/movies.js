const express = require("express");
const router = express.Router();
const movieFromOMDb = require("./omdb");
const { nanoid } = require("nanoid");
require("dotenv").config();
const authenticate = require("../authenticate");

const idLength = 8;

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
 *       example:
 *         id: qwerty
 *         Title: Example title
 *         Released: 1639661479674
 *         Genre: Example genre
 *         Director: Example director
 *         User: Example user
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

router.get("/", authenticate, (req, res) => {
  const movies = req.app.db.get("movies").find({ UserID: res.locals.userId });

  res.send(movies);
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

router.post("/", authenticate, async (req, res) => {
  try {
    const dataFromApi = await movieFromOMDb(encodeURI(req.body.title));
    const movie = {
      id: nanoid(idLength),
      Title: dataFromApi["Title"],
      Released: dataFromApi["Released"],
      Genre: dataFromApi["Genre"],
      Director: dataFromApi["Director"],
      UserID: res.locals.userId,
    };

    req.app.db.get("movies").push(movie).write();

    res.send(movie);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
