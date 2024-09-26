import express, { Application, Request, Response } from "express";

import cors from "cors";
import dotenv from "dotenv";
import { authRouters } from "./routes/auth";
import { userRouters } from "./routes/users";

const app: Application = express();

// * parsers
app.use(express.json());
app.use(cors());
dotenv.config();

// * routes

const getController = (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    health: "Okay!",
    Message: "App Is Running Wel!",
  });
};

app.use("/api/v1/user", userRouters);
app.use("/api/v1/auth", authRouters);
app.get("/", getController);

export default app;
