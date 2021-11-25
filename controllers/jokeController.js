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
  } catch (err) {
    if (err.message.includes("duplicate"))
      err.message = "Внесовте постоечки наслов";
    res.status(400).json({
      status: "fail",
      message:
        (err.errors && new AppPostError(err.errors).getObjectErrors()) ||
        err.message,
    });
  }
};

const approveJoke = async (req, res) => {
  try {
    const joke = await Joke.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!joke) throw new Error("Не постои");

    res.status(200).json({
      status: "success",
      data: {
        joke,
      },
    });
  } catch (err) {
    if (err.message.includes("Cast to Object failed")) {
    }
    err.message = "Не постои";
    res.status(400).json({
      status: "fail",
      message:
        (err.errors && new AppPostError(err.errors).getObjectErrors()) ||
        err.message,
    });
  }
};
const removeJoke = async (req, res) => {
  try {
    const joke = await Joke.findByIdAndDelete(req.params.id);
    
    if (!joke) throw new Error("Не постои");

    res.status(200).json({
      status: "success",
      data: {
        message: `Joke ${req.params.id} deleted!`,
      },
    });
  } catch (err) {
    if (err.message.includes("Cast to Object failed")) {
    }
    err.message = "Не постои";
    res.status(400).json({
      status: "fail",
      message:
        (err.errors && new AppPostError(err.errors).getObjectErrors()) ||
        err.message,
    });
  }
};

module.exports = {
  getAllJokes,
  getApprovedJokes,
  postJoke,
  approveJoke,
  getRandomJoke,
  removeJoke,
};
