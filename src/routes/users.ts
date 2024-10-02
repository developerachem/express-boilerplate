import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserSingle,
  updateUser,
} from "../controllers/users";
import tokenVerify from "../modules/tokenVerify";
import useFileUpload from "../utils/fileUpload";

// * Initiate Router
const router = express.Router();

// * Hokes
const { upload } = useFileUpload("profile");

// * Token Verification Middleware
router.use(tokenVerify);

// * Private Route
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserSingle);
router.delete("/:id", deleteUser);
router.patch("/:id", upload.single("image"), updateUser);

export const userRouters = router;
