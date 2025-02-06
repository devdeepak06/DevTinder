const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter)
app.use("/api/profile", profileRouter)
app.use("/api/request", requestRouter)

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
