const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddlewares");
const {
  getMessagesByChat,
  sendMessage,
} = require("../controllers/messageController");

// Get all messages of a chat
router.get("/:chatId", protect, getMessagesByChat);

// Send a message
router.post("/", protect, sendMessage);

module.exports = router;
