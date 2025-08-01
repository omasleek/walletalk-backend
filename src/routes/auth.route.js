import express from "express";
import {
  registerUser,
  loginUser,
  loginAdmin,
  requestNonce,
  verifySignature,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);
router.post("/wallet/nonce", requestNonce);
router.post("/wallet/verify", verifySignature);

export default router;
