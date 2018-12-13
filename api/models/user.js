const mongoose = require("mongoose");
const joi = require("joi");
const userSchema = new mongoose.Schema({
  _id: String,
  username: { type: String, minlength: 5, maxlength: 50, required: true },
  mail: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true
  },
  password: { type: String, minlength: 5, required: true }
});

/* Create the model from the schema. */
const User = mongoose.model("User", userSchema);
module.exports = User;
