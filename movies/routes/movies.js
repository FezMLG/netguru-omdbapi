const express = require("express");
const router = express.Router();

const Movie = require("../models/Movie");
const movieFromOMDb = require("./omdb");
const authenticate = require("../middleware/authenticate");
const checkForLimit = require("../middleware/checkForLimit");

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
    const movies = await Movie.find({ userID: res.locals.userId }).exec();
    res.json(movies);
  } catch (err) {
    res.json({ message: err });
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
    const movieExist = await Movie.exists({ title: req.body.title });
    if (movieExist)
      return res
        .status(409)
        .send(`Title ${req.body.title} already exist in database`);

    const dataFromApi = await movieFromOMDb(encodeURI(req.body.title));

    var new_user = new Movie({
      title: dataFromApi["Title"],
      released: dataFromApi["Released"],
      genre: dataFromApi["Genre"],
      director: dataFromApi["Director"],
      userID: res.locals.userId,
    });

    new_user.save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  } catch (error) {
    console.error(`Error with creating movie: ${err.message}`);
    return res.status(500).send({ message: "Error occurred" });
  }
});

module.exports = router;
