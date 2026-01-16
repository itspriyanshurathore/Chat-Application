const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddlewares");

const {
  createGroup,
  addMember,
  removeMember,
  promoteAdmin,
  demoteAdmin,
  getMyGroups,
  getAllGroups,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
} = require("../controllers/groupController");

/* ================= GROUP FETCH ================= */
router.get("/my", protect, getMyGroups);
router.get("/", protect, getAllGroups);

/* ================= GROUP CREATE ================= */
router.post("/create", protect, adminOnly, createGroup);

/* ================= USER ACTIONS ================= */
router.post("/:groupId/join", protect, joinGroup);
router.post("/:groupId/leave", protect, leaveGroup);

/* ================= GROUP UPDATE / DELETE ================= */
router.put("/:groupId", protect, adminOnly, updateGroup);
router.delete("/:groupId", protect, adminOnly, deleteGroup);

/* ================= MEMBER MANAGEMENT ================= */
router.post("/:groupId/add", protect, adminOnly, addMember);
router.post("/:groupId/remove", protect, adminOnly, removeMember);

/* ================= ADMIN ROLE ================= */
router.post("/:groupId/promote", protect, adminOnly, promoteAdmin);
router.post("/:groupId/demote", protect, adminOnly, demoteAdmin);

module.exports = router;
