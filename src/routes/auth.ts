import express from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  loginUser,
  resetPassword,
} from "../controllers/auth";
import { createUser } from "../controllers/users";
import tokenVerify from "../modules/tokenVerify";

// * Initiate Route
const router = express.Router();

// * Public Route
router.post("/login", loginUser);
router.post("/signup", createUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// * Token Verification Middleware
router.use(tokenVerify);

// * Private Route
router.get("/me", getMe);
router.post("/change-password", changePassword);

export const authRouters = router;
