import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("DB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5001, () => console.log("Server is running on port 5001"));
