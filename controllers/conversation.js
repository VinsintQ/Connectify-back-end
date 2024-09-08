const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const verifyToken = require("../middleware/verify-token");

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const saved = await newConversation.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:conversationId", async (req, res) => {
  try {
    const newConv = await Conversation.findByIdAndDelete(
      req.params.conversationId
    );
    res.status(200).json(newConv);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
