// ========================
// AUTH HANDLERS (user login/logout/session)
// ========================

// User login
const userLogin = async (req, res) => {
  const { nicOrPassport, password } = req.body;
  if (!nicOrPassport || !password) {
    return res.status(400).json({ message: "NIC and password required" });
  }
  try {
    const user = await User.findOne({ nicOrPassport });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid NIC or password" });
    }
    req.session.nic = user.nicOrPassport;
    const { password: _, ...safe } = user.toObject();
    res.json({ message: "Login success", user: safe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User logout
const userLogout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

// Get current user (session-based)
const getCurrentUser = async (req, res) => {
  if (!req.session.nic) return res.status(401).json({ message: "Not logged in" });
  try {
    const user = await User.findOne({ nicOrPassport: req.session.nic });
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = user.toObject();
    res.json(safe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
const User = require("../Model/userModel");

// ========================
// CRUD HANDLERS (admin side)
// ========================

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(404).json({ message: "No users found" });
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST add user
const addUsers = async (req, res) => {
  const {
    fullName, nicOrPassport, dateOfBirth, gender,
    address, mobile, email, insuranceType,
    username, password
  } = req.body;

  try {
    const userDoc = new User({
      fullName, nicOrPassport, dateOfBirth, gender,
      address, mobile, email, insuranceType,
      username, password
    });
    await userDoc.save();
    return res.status(201).json(userDoc);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate unique field" });
    }
    return res.status(400).json({ message: "Unable to add user" });
  }
};

// GET user by ID
const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Invalid user ID" });
  }
};

// UPDATE user by ID
const updateUser = async (req, res) => {
  try {
    const userDoc = await User.findById(req.params.id);
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    const fields = [
      "fullName", "nicOrPassport", "dateOfBirth", "gender", "address",
      "mobile", "email", "insuranceType", "username", "password"
    ];
    fields.forEach(f => {
      if (req.body[f] !== undefined) userDoc[f] = req.body[f];
    });

    await userDoc.save();
    return res.status(200).json(userDoc);
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate unique field" });
    }
    return res.status(400).json({ message: "Unable to update user" });
  }
};

// DELETE user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Invalid user ID" });
  }
};

// ========================
// PROFILE HANDLERS (user side)
// ========================

// GET current user profile (session NIC)
const getMyProfile = async (req, res) => {
  if (!req.session.nic) return res.status(401).json({ message: "Not logged in" });
  try {
    const user = await User.findOne({ nicOrPassport: req.session.nic });
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = user.toObject();
    res.json(safe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE current user profile
const updateMyProfile = async (req, res) => {
  if (!req.session.nic) return res.status(401).json({ message: "Not logged in" });
  try {
    const user = await User.findOne({ nicOrPassport: req.session.nic });
    if (!user) return res.status(404).json({ message: "User not found" });

    const fields = [
      "fullName", "dateOfBirth", "gender", "address",
      "mobile", "email", "insuranceType", "username", "password"
    ];
    fields.forEach(f => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });

    const saved = await user.save();
    const { password, ...safe } = saved.toObject();
    res.json(safe);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Update failed" });
  }
};

// ========================
// EXPORTS
// ========================
exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getMyProfile = getMyProfile;
exports.updateMyProfile = updateMyProfile;
exports.userLogin = userLogin;
exports.userLogout = userLogout;
exports.getCurrentUser = getCurrentUser;
