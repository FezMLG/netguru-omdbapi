import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { serve, setup } from "swagger-ui-express";
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

import swagger from './config/api-docs';
import moviesRouter from "./routes/movies";
import endpoint from './config/endpoints.config';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors);
app.use(express.json());
app.use(logger('dev'));

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use("/api/movies", moviesRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(""));
}

mongoose.connect(endpoint.DB_CONNECTION, () =>
  console.log("Connected to mongodb")
);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

export default app;
