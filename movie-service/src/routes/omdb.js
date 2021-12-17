const axios = require("axios");
require("dotenv").config();

const movieFromOMDb = async (title) => {
  try {
    const url = `https://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_TOKEN}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error with fetching data from OMDb: ${err.message}`);
    return res.status(500).send({ message: "Error occurred" });
  }
};

module.exports = movieFromOMDb;
