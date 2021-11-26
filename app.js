const express = require("express");
const jokeRouter = require("./routes/jokeRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/AppError");
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/jokes", jokeRouter);
app.use("/api/user", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} was not found`, 404));
});

//Global err handles

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  res.status(statusCode).json({
    status: status,
    message: err.message,
  });
});

module.exports = app;
