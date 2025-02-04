// src/models/User.js
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

const validator = require('validator');
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: validator.isStrongPassword,
        message: "Password must contain at least 8 characters, including an uppercase letter, a number, and a special character."
      }
    },
    age: {
      type: Number,
      min: 18,
      max: 50
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Please select a valid gender"
      }
    },
    photoUrl: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: (props) => `Invalid photo URL: ${props.value}`
      },
      default: "https://res.cloudinary.com/dkm44qhtl/image/upload/v1738429885/dummy%20avatar/yqavpipqbac218lxmebp.jpg"
    },
    about: {
      type: String,
      default: "This is a default about user!",
      trim: true
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 10 && new Set(v).size === v.length;
        },
        message: "Skills array exceeds the limit of 10 or contains duplicate entries."
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const ispasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return ispasswordValid;
};

module.exports = mongoose.model("User", userSchema);