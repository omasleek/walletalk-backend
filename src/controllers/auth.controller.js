import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";

// Generate JWT with role included
const generateToken = (id, role = "user") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// 🔹 Register User (can optionally be admin)
export const registerUser = async (req, res) => {
  const { email, password, role = "user" } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash, role });

  const token = generateToken(user._id, user.role);
  res.json({ user, token });
};

// 🔹 Login Normal User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  const token = generateToken(user._id, user.role);
  res.json({ user, token });
};

// 🔹 Login Admin Only
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
  if (!admin || admin.role !== "admin")
    return res.status(403).json({ msg: "Not authorized as admin" });

  if (!(await bcrypt.compare(password, admin.password)))
    return res.status(401).json({ msg: "Incorrect password" });

  const token = generateToken(admin._id, admin.role);
  res.json({ user: admin, token });
};

// 🔹 Wallet-Based Login: Request Nonce
export const requestNonce = async (req, res) => {
  const { address } = req.body;
  let user = await User.findOne({ address });

  const nonce = "Sign this nonce to login: " + Date.now();

  if (!user) user = await User.create({ address, nonce });
  else user.nonce = nonce;

  await user.save();
  res.json({ nonce });
};

// 🔹 Verify Signature from Wallet
export const verifySignature = async (req, res) => {
  const { address, signature } = req.body;

  const user = await User.findOne({ address });
  if (!user || !user.nonce)
    return res.status(400).json({ msg: "No nonce found" });

  const recovered = ethers.verifyMessage(user.nonce, signature);
  if (recovered.toLowerCase() !== address.toLowerCase())
    return res.status(401).json({ msg: "Signature mismatch" });

  user.nonce = "";
  await user.save();

  const token = generateToken(user._id, user.role);
  res.json({ user, token });
};
