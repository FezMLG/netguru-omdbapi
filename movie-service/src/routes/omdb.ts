import get from "axios";
import {Response} from 'express';
require("dotenv").config();

const movieFromOMDb: any = async (title: string, res: Response) => {
  try {
    const url = `https://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_TOKEN}`;
    const response = await get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error with fetching data from OMDb: ${error.message}`);
    return res.status(500).send({ message: "Error occurred" });
  }
};

export default movieFromOMDb;
