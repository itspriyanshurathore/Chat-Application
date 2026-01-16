const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Controller functions
const { registerUser } = require("../controllers/registerController");
const { authUser } = require("../controllers/loginController");
const { getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddlewares");

// User registration route
userRouter.post("/register", registerUser);
// User login route
userRouter.post("/login", authUser);
// Get user profile route
userRouter.get("/profile", protect, getUserProfile);

module.exports = userRouter;
