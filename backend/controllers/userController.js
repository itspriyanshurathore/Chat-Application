const User = require("../models/UserModel");

const getUserProfile = async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.id).select("-password");

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUserProfile };
