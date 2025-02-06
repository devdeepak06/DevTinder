const express = require("express");
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validateProfilePassword } = require("../utils/validation")
const profileRouter = express.Router();
const bcrypt = require('bcrypt');

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      data: user
    });
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      res.status(400).send("Invalid edit request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile update successful!`,
      data: loggedInUser
    })
  } catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }
})
profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    if (!validateProfilePassword(req)) {
      res.status(400).send("Invalid password");
    }

    const loggedInUser = req.user;
    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Update the user's password
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile password update successful!`
    })
  } catch (error) {
    res.status(500).send("ERROR : " + error.message);
  }
})

module.exports = profileRouter;
