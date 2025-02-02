const express = require('express');
// const cors = require('cors');
const bcrypt = require('bcrypt');
const connectDB = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(express.json());
// app.use(cors());

// Signup endpoint - POST /signup
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already in use.");
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

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

// Get user by email - GET /user?email=example@example.com
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("Error getting the user: " + err.message);
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
      return res.status(404).send("User not found.");
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("Error getting the user: " + err.message);
  }
});

// Delete user by ID - DELETE /user/:id
app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send({ message: "User deleted successfully!", user });
  } catch (err) {
    res.status(500).send("Error deleting the user: " + err.message);
  }
});

// Update user - PATCH /user/:id
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    // Allow only specific fields to be updated
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    if (data.skills) {
      if (!Array.isArray(data.skills)) {
        return res.status(400).send({ error: "Skills must be an array" });
      }
      if (data.skills.length > 10) {
        return res.status(400).send({ error: "Skills cannot be more than 10" });
      }
      if (new Set(data.skills).size !== data.skills.length) {
        return res.status(400).send({ error: "Duplicate skills are not allowed" });
      }
    }

    // Update the user
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.json(user);
  } catch (err) {
    res.status(500).send("Error updating the user: " + err.message);
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
