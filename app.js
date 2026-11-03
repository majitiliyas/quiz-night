// Main file of the application: settings, middleware and routes
require("dotenv").config(); // reads variables from the .env file into process.env

const express = require("express");
const path = require("path");

const logger = require("./middleware/logger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const quizRoutes = require("./routes/quizRoutes");

const app = express();
const port = process.env.PORT || 3000;

// EJS is our view engine, templates are in the "views" folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 1) custom middleware - logs every request
app.use(logger);
// 2) built-in middleware - css/images from "public"
app.use(express.static(path.join(__dirname, "public")));
// 3) built-in middleware - reads form data into req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// all pages of the app
app.use("/", quizRoutes);

// 404 for unknown routes (must be after all routes)
app.use(notFound);
// centralized error handler (must be the last one)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Quiz Night is running on http://localhost:${port}`);
});
