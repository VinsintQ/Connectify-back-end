const express = require("express");
const router = express.Router();
const Message = require("../models/message");

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const saved = await newMessage.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:massegeId", async (req, res) => {
  try {
    const newMessage = await Message.findByIdAndDelete(req.params.massegeId);
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:massegeId", async (req, res) => {
  try {
    const newMessage = await Message.findByIdAndUpdate(
      req.params.massegeId,
      req.body,
      { new: true }
    );
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
