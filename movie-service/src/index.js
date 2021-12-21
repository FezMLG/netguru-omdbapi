const express = require("express");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");
const moviesRouter = require("./routes/movies");
const swagger = require("./config/api-docs");
// const cors = require("./config/cors");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/api-docs", swaggerUI.serve, swaggerUI.setup(swagger));
app.use("/api/movies", moviesRouter);

// This comment will trigger PR another
mongooseconnect(
  process.env.MONGODB_URI || process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to mongodb")
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(""));
}

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

module.exports = app;
