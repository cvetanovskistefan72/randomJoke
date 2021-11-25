const Joke = require("../models/jokeModel");
const AppPostError = require("../utils/AppPostError");

const getRandomJoke = async (req, res) => {
  try {
    const jokes = await Joke.find();
    var joke = jokes[Math.round(Math.random() * (jokes.length - 1))];
    res.status(200).json({
      status: 200,
      data: {
        joke,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getAllJokes = async (req, res) => {
  try {
    const jokes = await Joke.find();
    res.status(200).json({
      status: 200,
      results: jokes.length,
      data: {
        jokes: jokes,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getApprovedJokes = async (req, res) => {
  try {
    const jokes = await Joke.find({ approved: true });
    res.status(200).json({
      status: 200,
      data: {
        jokes: jokes,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

const postJoke = async (req, res) => {
  req.body.approved = false;
  try {
    const newJoke = await Joke.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        joke: newJoke,
      },
    });
  } catch ({ errors }) {
    res.status(400).json({
      status: "fail",
      message: new AppPostError(errors).getObjectErrors(),
    });
  }
};

const approveJoke = async (req, res) => {
  try {
    const joke = await Joke.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        joke,
      },
    });
  } catch ({ errors }) {
    res.status(400).json({
      status: "fail",
      message: new AppPostError(errors).getObjectErrors(),
    });
  }
};

module.exports = {
  getAllJokes,
  getApprovedJokes,
  postJoke,
  approveJoke,
  getRandomJoke,
};
