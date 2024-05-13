const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

const mongoose = require("mongoose");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.info("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);
app.use(cors());
app.use(express.json());
app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

module.exports = app;
