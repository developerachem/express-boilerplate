import express from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  loginUser,
  resetPassword,
} from "../controllers/auth";
import tokenVerify from "../modules/tokenVerify";

const router = express.Router();

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.use(tokenVerify);

router.get("/me", getMe);
router.post("/change-password", changePassword);

export const authRouters = router;
