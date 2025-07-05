const express = require("express");
const Chat = require("../models/Chat");
const router = express.Router();

// GET /api/chat/:requestId
router.get("/:requestId", async (req, res) => {
  try {
    const messages = await Chat.find({ requestId: req.params.requestId }).sort("timestamp");
    res.json(messages);
  } catch {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { requestId, sender, text } = req.body;
    const chat = new Chat({ requestId, sender, text });
    await chat.save();
    res.status(201).json(chat);
  } catch {
    res.status(500).json({ message: "Failed to save message" });
  }
});

module.exports = router;
