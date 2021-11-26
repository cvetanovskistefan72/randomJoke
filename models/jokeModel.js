const defaultTypes = require("../config/config");
const mongoose = require("mongoose");

// const validator = require('validator');

const jokesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Насловот е задолжителен"],
      unique: true,
      trim: true,
      maxLength: [20, "Насловот не смее да има повеќе од 20 карактери"],
    },
    description: {
      type: String,
      required: [true, "Описот е задолжителен"],
      minLength: [20, "Описот не смее да има помалку од 20 карактери"],
      maxLength: [300, "Опиост не смее да има повеќе од 300 карактери"],
    },
    type: {
      type: String,
      required: [true, "Тип е задолжително"],
    },
    approved: Boolean,
    name: {
      type: String,
      required: [true, "Внесете име и презиме"],
    },
    date: Date,
    
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jokesSchema.virtual("color").get(function() {
  return defaultTypes.get(this.type);
});
jokesSchema.pre("save", async function(err, doc, next) {
  this.date = new Date().toISOString();
  next();
});

const Joke = mongoose.model("Joke", jokesSchema);

module.exports = Joke;
