const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../models/userModel");
const AppPostError = require("../utils/AppPostError");
const AppError = require("../utils/AppError");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.APP_CODE, {
    expiresIn: "90d",
  });
};

const signUp = async (req, res) => {
  try {
    const user = await User.create({
      code: req.body.code,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    user.password = undefined;
    res.status(200).json({
      status: "created",
      data: {
        token: signToken(user.id),
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: (err.errors &&
        new AppPostError(err.errors).getObjectErrors()) || {
        email: err.message,
      },
    });
  }
};

const signIn = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      throw new Error("Внесете е-маил и лозинка");
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) throw new Error("Внесовте погрешен е-маил и лозинка");
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) throw new Error("Внесовте погрешена лозинка");

    res.status(200).json({
      status: "OK",
      data: {
        token: signToken(user.id),
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const protectRoute = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await jwt.verify(token, process.env.APP_CODE);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  next()
};

module.exports = { signUp, signIn, protectRoute };
