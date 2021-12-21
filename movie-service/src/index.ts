import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { serve, setup } from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import * as dotenv from 'dotenv';

dotenv.config();

import moviesRouter from "./routes/movies";
const PORT = process.env.PORT || 4000;
const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);
const app = express();

app.use(cors);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api-docs", serve, setup(specs));
app.use("/api/movies", moviesRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(""));
}

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

export default app;
