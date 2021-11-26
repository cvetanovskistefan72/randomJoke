const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  code: {
    required: [true, "Внеси код"],
    type: String,
    validate: {
      validator: function(el) {
        return el === process.env.APP_CODE;
      },
      message: "Внесете код за да креирате Администратор",
    },
  },
  email: {
    type: String,
    required: [true, "Внесете е-маил"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Внесете е-маил"],
  },
  password: {
    type: String,
    required: [true, "Внесете лозинка"],
    minlength: [8, "Лозинката треба да има минимум 8 карактери"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Потврди лозинка"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: "Лозинките не се совпаѓаат!",
    },
  },
});

userSchema.post("save", function(error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Е-маил адресата е веќе постоечка"));
  } else {
    next(error);
  }
});

userSchema.pre("save", async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
