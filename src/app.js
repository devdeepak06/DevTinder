const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User');
const app = express();
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require("validator");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { userAuth } = require('./middlewares/auth');
dotenv.config();

app.use(express.json());
app.use(cookieParser());
// Signup endpoint - POST /signup
app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
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
    res.status(201).send("User added successfully!");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send("Email already exists.");
    }
    res.status(500).send("ERROR : " + err.message);
  }
});

// Login endpoint - post /login
app.post("/login", async (req, res) => {
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

    // Compare password
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
      return res.status(401).send("Invalid credentials!");
    }
    // create jwt token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // cookie is set with the jwt token
    res.cookie("token", token);
    // Login successful
    res.status(200).send("Login Successful!");

  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully!");
});

// Connect to database and start server
connectDB()
  .then(() => {
    console.log('Database connection established...');
    app.listen(7777, () => {
      console.log('Server is listening on http://localhost:7777');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
