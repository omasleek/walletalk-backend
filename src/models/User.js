import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  address: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  avatarUrl: String,
  ensName: String,
  nonce: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
