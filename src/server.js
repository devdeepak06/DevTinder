const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User');
const app = express();
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require("validator");
app.use(express.json());

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

    // Login successful
    res.status(200).send("Login Successful!");

  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

// Get user by email - GET /user?email=example@example.com
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    // const user = await User.find({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid credentials!");
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

// Get all users - GET /feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send("Error getting users: " + err.message);
  }
});

// Get user by ID - GET /user/:id
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Invalid credentials!");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

// Delete user by ID - DELETE /user/:id
app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("Invalid credentials!");
    }
    res.send({
      message: "User deleted successfully!"
    });
  } catch (err) {
    res.status(500).send("Error deleting the user: " + err.message);
  }
});

// Update user - PATCH /user/:id
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // Ensure no unintended fields are updated
    const data = req.body;
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    if (data.skills && data.skills.length > 10) {
      return res.status(400).send({ error: "Skills cannot be more than 10" });
    }
    if (new Set(data.skills).size !== data.skills.length) {
      return res.status(400).send({ error: "Duplicate skills are not allowed" });
    }

    // Update the user and return the updated document
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).send("Invalid credentials!");
    }
    res.send(user);
  } catch (err) {
    console.error("ERROR ", err.message);
    res.status(500).send("ERROR " + err.message);
  }
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
