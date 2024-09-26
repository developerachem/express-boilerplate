import express from "express";
import { changePassword, getMe, loginUser } from "../controllers/auth";
import tokenVerify from "../modules/tokenVerify";

const router = express.Router();

router.post("/login", loginUser);

router.use(tokenVerify);

router.get("/me", getMe);
router.post("/change-password", changePassword);

export const authRouters = router;
