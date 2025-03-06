const express = require("express");
const User = require('../models/User');
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require('bcrypt');
const validator = require("validator");
const { userAuth } = require('../middlewares/auth');
const authRouter = express.Router();

// Signup endpoint - POST /signup
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    const validationResult = validateSignUpData(req);
    if (!validationResult) {
      return res.status(400).json({ error: validationResult.error });
    }

    const { firstName, lastName, email, password } = req.body;

    //Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Invalid credentials!");
    }
    // create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash
    });

    await user.save();
    res.status(201).json({
      message: `${user.firstName}, your profile was created successfully! Welcome to DevTinder.`,
      data:user
    });
  } catch (err) {
    res.status(500).send("ERROR : " + err.message);
  }
});

// Login endpoint - post /login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trim and validate email
    if (!email || !password) {
      return res.status(400).send("Email and password are required!");
    }

    const trimmedEmail = email.trim();
    if (!validator.isEmail(trimmedEmail)) {
      return res.status(401).send("Invalid credentials!");
    }

    // Find user by email
    const user = await User.findOne({ email: trimmedEmail });
    if (!user || !user.password) {
      return res.status(401).send("Invalid credentials!");
    }

    // Compare password using custom validatePassword method
    const ispasswordValid = await user.validatePassword(password);
    if (!ispasswordValid) {
      return res.status(401).send("Invalid credentials!");
    }
    // Generate JWT token
    const token = await user.getJWT();

    // cookie is set with the jwt token
    res.cookie("token", token, {
      expires: new Date(Date.now() + 604800000),
    });
    // Login successful
    res.status(200).json({
      data: user
    });

  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  // res.clearCookie("token");
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({
    message: `${req.user.firstName}, logged out successfully!`
  });
});

authRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send("Error getting users: " + err.message);
  }
});


module.exports = authRouter;