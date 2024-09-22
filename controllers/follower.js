const express = require("express");

const router = express.Router();
const User = require("../models/user");

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const followers = user.Followers;
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-follower", async (req, res) => {
  try {
    const { username, userId, image } = req.body;
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

router.delete("/:userId/follower/:followerId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  user.Followers = user.Followers.filter((follower) => {
    return follower.id !== req.params.followerId;
  });
  user.save();

  res.status(200).json({ message: "Follower deleted success" });
});

module.exports = router;
