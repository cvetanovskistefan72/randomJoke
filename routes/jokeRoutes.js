const express = require("express");
const {
  getAllJokes,
  getApprovedJokes,
  postJoke,
  approveJoke,
  getRandomJoke,
  removeJoke,
} = require("../controllers/jokeController");
const { protectRoute } = require("../controllers/userController");

const router = express.Router();

router
  .route("/")
  .get(protectRoute, getAllJokes)
  .post(protectRoute, postJoke);

router.route("/approved").get(protectRoute, getApprovedJokes);

router.route("/randomJoke").get(getRandomJoke);

router
  .route("/:id")
  .patch(protectRoute, approveJoke)
  .delete(protectRoute, removeJoke);

module.exports = router;
