const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User');
const app = express();

app.use(express.json());

// Signup endpoint
app.post("/signup", async (req, res) => {
  try {
    const { email, firstName, lastName, password, gender, age } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).send("All required fields (email, firstName, lastName, password) must be provided.");
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User with this email already exists.");
    }

    // Create a new user
    const user = new User({
      email,
      firstName,
      lastName,
      password,
      gender,
      age,
    });

    // Save user to database
    await user.save();
    res.status(201).send("User added successfully!");
  } catch (err) {
    console.error("Error saving the user:", err.message);
    res.status(500).send("Error saving the user: " + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send(user);
  } catch (err) {
    console.error("Error getting the user:", err.message);
    res.status(500).send("Error getting the user: " + err.message);
  }
});

// Get user by id
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send(user);
  } catch (err) {
    console.error("Error getting the user:", err.message);
    res.status(500).send("Error getting the user: " + err.message);
  }
});

// Feed api- Get/feed - get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error("Error getting users:", err.message);
    res.status(500).send("Error getting users: " + err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send({
      message: "User deleted successfully!",
      user,
    });
  } catch (err) {
    console.error("Error deleting the user:", err.message);
    res.status(500).send("Error deleting the user: " + err.message);
  }
});

// Update user 
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // Ensure no unintended fields are updated
    const updates = req.body;
    // Update the user and return the updated document
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send(user);
  } catch (err) {
    console.error("Error updating the user:", err.message);
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
