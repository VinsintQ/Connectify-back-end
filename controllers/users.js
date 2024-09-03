const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
//models
const User = require("../models/user");

//Routes

router.post("/signup", async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.status(400).json({ error: "Username already taken." }); //BAD IDEA TO SAY USER IS EXIST
    }
    // Create a new user with hashed password
    const user = await User.create({
      Email: req.body.Email,
      hashedPassword: bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALT)
      ),
      location: req.body.location,
      Firstname: req.body.FirstName,
      Lastname: req.body.LastName,
    });
    const token = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET
    );
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// other routes here

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign(
        { Email: user.Eamil, _id: user._id },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-follower", async (req, res) => {
  try {
    const { username, userId } = req.body;
    const userToAdd = await User.findOne({ username: username });
    if (!userToAdd) {
      return res.status(404).json({ error: "User to add not found." });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found." });
    }

    const alreadyFollowed = currentUser.Followers.some(
      (friend) => friend.username === username
    );
    if (alreadyFollowed) {
      return res
        .status(400)
        .json({ error: "Username is already in your friends list." });
    }

    currentUser.Followers.push(userToAdd);
    await currentUser.save();

    res.status(200).json({ message: "Friend added successfully." });
  } catch (error) {
    console.error("Error adding friend:", error);
    res
      .status(400)
      .json({ error: "An error occurred while adding the friend." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error("Something went wrong");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-friend", async (req, res) => {
  try {
    const { username, userId } = req.body;
    const userToAdd = await User.findOne({ username: username });
    if (!userToAdd) {
      return res.status(404).json({ error: "User to add not found." });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found." });
    }

    const alreadyfriend = currentUser.Friends.some(
      (friend) => friend.username === username
    );
    if (alreadyfriend) {
      return res
        .status(400)
        .json({ error: "Username is already in your friends list." });
    }

    currentUser.Friends.push(userToAdd);
    await currentUser.save();

    res.status(200).json({ message: "Friend added successfully." });
  } catch (error) {
    console.error("Error adding friend:", error);
    res
      .status(400)
      .json({ error: "An error occurred while adding the friend." });
  }
});

module.exports = router;
