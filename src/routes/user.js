const express = require("express");
const User = require('../models/User');
const userRouter = express.Router();


userRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      message: "Users fetched successfully!",
      data: users,
    });
  } catch (err) {
    res.status(500).send("Error getting users: " + err.message);
  }
});

module.exports = userRouter;