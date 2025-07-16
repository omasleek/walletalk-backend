import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ethers } from "ethers";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "Email already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });
  const token = generateToken(user._id);
  res.json({ user, token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  const token = generateToken(user._id);
  res.json({ user, token });
};

export const requestNonce = async (req, res) => {
  const { address } = req.body;
  let user = await User.findOne({ address });

  const nonce = "Sign this nonce to login: " + Date.now();
  if (!user) user = await User.create({ address, nonce });
  else user.nonce = nonce;

  await user.save();
  res.json({ nonce });
};

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
  const token = generateToken(user._id);
  res.json({ user, token });
};
