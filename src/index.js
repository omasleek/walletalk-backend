import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173", // dev frontend
  "https://walletalk.netlify.app", // deployed frontend
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



app.use(express.json()); // <-- THIS is what you need!

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("DB Error:", err));

app.use("/api/auth", authRoutes);

app.listen(5001, () => console.log("Server is running on port 5001"));
