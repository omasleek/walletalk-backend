import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  address: { type: String, unique: true, sparse: true }, // for wallet login
  email: { type: String, unique: true, sparse: true }, // for normal/login
  password: { type: String },

  avatarUrl: String,
  ensName: String,

  nonce: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
