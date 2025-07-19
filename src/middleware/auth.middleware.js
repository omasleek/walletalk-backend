import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware: Protect routes by verifying JWT token
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = user; // Attach full user object to request
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// ✅ Middleware: Restrict route to admin-only access
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied: Admins only" });
  }

  next();
};
