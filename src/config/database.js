// src/config/database

const mongoose = require('mongoose');
const connectDB = async () => {
  await mongoose.connect('mongodb+srv://kdeepak2217:9saOQZpdJph3Y1Jr@cluster0.lg6ur.mongodb.net/devTinder');
}

module.exports = connectDB;