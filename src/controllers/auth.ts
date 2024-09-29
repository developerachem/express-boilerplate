import bcrypt from "bcrypt";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User, UserType } from "../model/users";
import { sendMail } from "../utils/mailSend";

// * Controller for logging in a user
export const loginUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.body.email || !req.body.password) {
        res.status(400).json({
          message: "Email and password are required",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      // * Check User Exist or not
      const userExists = await User.findOne({ email: req.body.email });

      // * Response if user not exists
      if (!userExists) {
        res.status(404).json({
          message: "User not found",
          success: false,
          status: 404,
          url: req.originalUrl,
        });
        return;
      }

      // * Match Password using bcrypt
      const isMatch = await bcrypt.compare(
        req.body.password,
        userExists.password
      );

      // * Response if password not match
      if (!isMatch) {
        res.status(401).json({
          message: "Wrong password",
          success: false,
          status: 401,
          url: req.originalUrl,
        });
        return;
      }

      // * Device Token Update to User if device token is given
      if (req.body.deviceToken) {
        userExists.deviceToken = req.body.deviceToken;
        await userExists.save();
      }

      // * Generate JWT Token
      const token = jwt.sign(
        { id: userExists._id, name: userExists.name, email: userExists.email },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXP as string }
      );

      // * Login Response
      res.status(200).json({
        message: "Login successfully",
        success: true,
        status: 200,
        user: userExists,
        token,
        url: req.originalUrl,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        status: 500,
        error: err,
        url: req.originalUrl,
      });
    }
  }
);

// * Get Me
export const getMe = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (req.me) {
        const { id } = req.me;

        // * Get User By ID
        const user = await User.findById(id);

        // * Response if user not found
        if (!user) {
          res.status(404).json({
            message: "User not found",
            success: false,
            status: 404,
            url: req.originalUrl,
          });
          return;
        }

        // * User data fetched successfully
        res.status(200).json({
          message: "Data Found",
          success: true,
          status: 200,
          user,
          url: req.originalUrl,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        status: 500,
        error: err,
        url: req.originalUrl,
      });
    }
  }
);

// * Change Password
export const changePassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.me) {
        res.status(401).json({
          message: "Unauthorized User",
          success: false,
          status: 401,
          url: req.originalUrl,
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      // * Response If Current password and new password is Same
      if (currentPassword === newPassword) {
        res.status(400).json({
          message: "Current Password and New Password should not be same",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      // * Check Current Password
      const user = await User.findById(req.me.id);

      // * Response if user not found
      if (!user) {
        res.status(404).json({
          message: "User not found",
          success: false,
          status: 404,
          url: req.originalUrl,
        });
        return;
      }

      // * Match Password using bcrypt
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      // * Response if password not match
      if (!isMatch) {
        res.status(404).json({
          message: "Current password is wrong",
          success: false,
          status: 404,
          url: req.originalUrl,
        });
        return;
      }

      // * Hash New Password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // * Update Password
      user.password = hashedPassword;
      await user.save();

      // * Send Mail After Change Password
      const mailPayload = {
        to: user.email,
        subject: "Password Changed Successfully",
        message: "Your password has been changed successfully.",
      };
      sendMail(mailPayload);

      // * Password changed successfully
      res.status(200).json({
        message: "Password changed successfully",
        success: true,
        status: 200,
        url: req.originalUrl,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        status: 500,
        error: err,
        url: req.originalUrl,
      });
    }
  }
);

// * Forgot Password
export const forgotPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.body.email) {
        res.status(400).json({
          message: "Email is required",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      // * Check User Exist or not
      const userExists = await User.findOne({ email: req.body.email });

      // * Response if user not exists
      if (!userExists) {
        res.status(404).json({
          message: "User not found",
          success: false,
          status: 404,
          url: req.originalUrl,
        });
        return;
      }

      // * Generate 4 Digit OTP For the verification
      const randomOtp = Math.floor(100000 + Math.random() * 900000);

      // * Generate Reset Token
      const resetToken = jwt.sign(
        { email: userExists.email, otp: randomOtp },
        process.env.RESET_TOKEN_SECRET as string,
        { expiresIn: "50m" }
      );

      // * Send Mail After Forgot Password
      const mailPayload = {
        to: userExists.email,
        subject: "Reset Password",
        message: `To reset your password, please <a href="http://${req.headers.host}/reset-password/${resetToken}">Click</a> <br /> Your OTP is: <b>${randomOtp}</b> <br /> OTP Validity Only 5 Minutes`,
      };
      sendMail(mailPayload);

      // * Password forgotten successfully
      res.status(200).json({
        message: "Password forgotten successfully",
        // OTP: randomOtp,
        success: true,
        status: 200,
        url: req.originalUrl,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        status: 500,
        error: err,
        url: req.originalUrl,
      });
    }
  }
);

interface DecodeType {
  email: string;
  otp: number;
}
// * Reset Password
export const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const resetToken = req.params.token;

      if (!req.body.password) {
        res.status(400).json({
          message: "Password is required",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      if (!req.body.otp) {
        res.status(400).json({
          message: "OTP is required",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      // * Verify Token
      const decoded = jwt.verify(
        resetToken,
        process.env.RESET_TOKEN_SECRET as string
      );

      const { email, otp }: DecodeType | any = decoded;

      // * Check if token is expired
      if (!decoded) {
        res.status(400).json({
          message: "Token Expired",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      // * Match OTP
      if (otp !== parseInt(req.body.otp)) {
        res.status(400).json({
          message: "Invalid OTP",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      // * Check if email matches with the token
      if (email !== req.body.email) {
        res.status(400).json({
          message: "Invalid Email Address",
          success: false,
          status: 400,
          url: req.originalUrl,
        });
        return;
      }

      // * Hash New Password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // * Update Password
      const user: UserType | any = await User.findOneAndUpdate(
        { email: req.body.email },
        { password: hashedPassword },
        { new: true }
      );

      // * Send Mail After Reset Password
      const mailPayload = {
        to: user.email,
        subject: "Password Reset Successfully",
        message: "Your password has been reset successfully.",
      };
      sendMail(mailPayload);

      // * Password reset successfully
      res.status(200).json({
        message: "Password reset successfully",
        success: true,
        user,
        status: 200,
        url: req.originalUrl,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        success: false,
        status: 500,
        error: error,
        url: req.originalUrl,
      });
    }
  }
);
