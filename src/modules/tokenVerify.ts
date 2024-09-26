import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../model/users";

interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

const tokenVerify = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers.authorization;

    // * Check Authorization
    if (!headers) {
      res.status(401).json({
        status: 401,
        message: "Unauthorize User",
        url: req.originalUrl,
      });
      return;
    }

    // * Token
    const token = headers.split(" ")[1];
    const accessToken = process.env.ACCESS_TOKEN as string;

    // * Verify Token
    jwt.verify(token, accessToken, async (err, decode) => {
      if (err) {
        res.status(401).json({
          status: 401,
          message: "Invalid Authorization",
          url: req.originalUrl,
        });
        return;
      } else {
        const decodeData = decode as JwtPayload;
        const me = await User.findOne({ email: decodeData.email });

        if (!me) {
          res.status(401).json({
            status: 401,
            message: "Invalid User",
            url: req.originalUrl,
          });
          return;
        }

        req.me = {
          id: me._id.toString(),
          email: me.email,
          name: me.name,
        };

        next();
      }
    });
  }
);

export default tokenVerify;
