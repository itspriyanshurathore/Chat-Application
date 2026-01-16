const Group = require("../models/GroupsModel");
const User = require("../models/UserModel");

/* ================= CREATE GROUP ================= */
const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name required" });
    }

    const creatorId = req.user._id;

    const group = await Group.create({
      name,
      description,
      members: [creatorId], // auto add creator
      admins: [creatorId], // creator is admin
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("CREATE GROUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADD MEMBER ================= */
const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.admins.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyMember = group.members.some(
      (id) => id.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already in group" });
    }

    group.members.push(user._id);
    await group.save();

    res.json({ message: "Member added", group });
  } catch (err) {
    console.error("ADD MEMBER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REMOVE MEMBER ================= */
const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.admins.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    group.members = group.members.filter((id) => id.toString() !== userId);

    group.admins = group.admins.filter((id) => id.toString() !== userId);

    await group.save();
    res.json({ message: "Member removed", group });
  } catch (err) {
    console.error("REMOVE MEMBER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= PROMOTE ADMIN ================= */
const promoteAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.admins.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    const alreadyAdmin = group.admins.some((id) => id.toString() === userId);

    if (!alreadyAdmin) {
      group.admins.push(userId);
    }

    await group.save();
    res.json({ message: "User promoted to admin", group });
  } catch (err) {
    console.error("PROMOTE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DEMOTE ADMIN ================= */
const demoteAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.admins.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    group.admins = group.admins.filter((id) => id.toString() !== userId);

    await group.save();
    res.json({ message: "Admin removed", group });
  } catch (err) {
    console.error("DEMOTE ADMIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET MY GROUPS ================= */
const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [{ members: req.user._id }, { admins: req.user._id }],
    })
      .populate("members", "username email")
      .populate("admins", "username email");

    res.json(groups);
  } catch (err) {
    console.error("GET MY GROUPS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL GROUPS (ADMIN) ================= */
const getAllGroups = async (req, res) => {
  try {
    //console.log("🔥 /api/groups hit");
    //console.log("🔥 req.user:", req.user);

    const groups = await Group.find()
      .populate("admins", "username email")
      .populate("members", "username email");

    return res.json(groups);
  } catch (error) {
    console.error("❌ GET ALL GROUPS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================= UPDATE GROUP ================= */
const updateGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.admins.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    group.name = name || group.name;
    group.description = description || group.description;

    await group.save();
    res.json(group);
  } catch (error) {
    console.error("UPDATE GROUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE GROUP ================= */
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = group.admins.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin only action" });
    }

    await group.deleteOne();
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("DELETE GROUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const alreadyMember = group.members.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    group.members.push(req.user._id);
    await group.save();

    res.json({ message: "Joined group", group });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.members = group.members.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    group.admins = group.admins.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await group.save();
    res.json({ message: "Left group" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};
