const Message = require("../models/ChatModel");

const getMessagesByChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email")
      .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    const newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    const populatedMessage = await newMessage.populate(
      "sender",
      "name email"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

module.exports = {
  getMessagesByChat,
  sendMessage,
};
