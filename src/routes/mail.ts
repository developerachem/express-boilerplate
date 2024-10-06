import express from "express";
import { sendMailToUser } from "../controllers/mail";
import tokenVerify from "../modules/tokenVerify";
import useFileUpload from "../utils/fileUpload";

// * Initiate Router
const router = express.Router();

// * Hokes
const { upload } = useFileUpload("profile");

// * Token Verification Middleware
router.use(tokenVerify);

// * Private Route
router.post("/", sendMailToUser);

export const mailSender = router;
