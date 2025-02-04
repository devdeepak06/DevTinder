const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Unauthorized access!");
    }
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedMessage) {
      return res.status(401).send("Unauthorized access!");
    }
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("Unauthorized access!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
}

module.exports = {
  userAuth
};