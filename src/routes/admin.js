import express from "express";
import {
  getAllUsers,
  promoteToAdmin,
} from "../controllers/admin.controller.js";
import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.post("/promote", protect, isAdmin, promoteToAdmin);

export default router;
