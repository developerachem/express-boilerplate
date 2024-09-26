import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserSingle,
  updateUser,
} from "../controllers/users";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserSingle);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

export const userRouters = router;
