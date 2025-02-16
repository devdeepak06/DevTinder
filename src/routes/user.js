const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require('../models/User');


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
// get all the pending connection request for the logged in users

userRouter.get("/requests/received", userAuth, async (req, res) => {

  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests
    })
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {

  try {
    const loggedInUser = req.user;
    const connectionAccepted = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted"
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted"
        }
      ]
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
    // console.log(connectionAccepted);
    // const data = connectionAccepted.map((row) => row.fromUserId)
    const data = connectionAccepted.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data })
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    // User should see all the user cards except
    // 1. his/her own card
    // 2. his/her connections
    // 3. ignored peoples
    // 4. already sent the connection request

    const loggedInUser = req.user;
    // console.log(loggedInUser);

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit; //to skip the users

    // Find all connection requests ( sent + received)
    const connectionsRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionsRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    })

    // console.log(hideUsersFromFeed);
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA).skip(skip).limit(limit);
    res.json({ data: users });
  } catch (err) {
    res.status(500).send("Error getting users: " + err.message);
  }
});

module.exports = userRouter;