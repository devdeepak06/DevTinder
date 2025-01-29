// src/models/User.js
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: String,
  age: Number
});

module.exports = mongoose.model("User", userSchema);