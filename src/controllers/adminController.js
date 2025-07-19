import User from "../models/User.js";

// 🔹 Get all users (admin only)
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// 🔹 Example: promote a user to admin
export const promoteToAdmin = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: "User not found" });

  user.role = "admin";
  await user.save();

  res.json({ msg: "User promoted to admin", user });
};
