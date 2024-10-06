import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { sendMail } from "../utils/mailSend";

// * Send Mail To any user controller
export const sendMailToUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, body, subject } = req.body;

    if (req.me) {
      const mailPayload = {
        to: email,
        from: req.me.email,
        subject,
        message: body,
      };

      sendMail(mailPayload);
      console.log(mailPayload);
    }

    res.status(200).json({
      message: "Email sent successfully",
      success: true,
      status: 200,
      url: req.originalUrl,
    });
  }
);
