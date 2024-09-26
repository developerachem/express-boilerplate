import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../model/users";
import { userRegistrationSchema } from "../validations/userValidation";

// * Get Users
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    // * Get Users from Mongoose
    const users = await User.find();

    // * If no users found, send a 404 response
    if (!users.length) {
      res.status(200).json({
        message: "No users found",
        success: false,
        status: 404,
        data: [],
        url: req.originalUrl,
      });
      return;
    }

    // * If users found, send a 200 response with all users
    res.status(200).json({
      data: users,
      message: "Data Get successfully",
      success: true,
      status: 200,
      url: req.originalUrl,
    });
  } catch (error) {
    // * Error Response Send
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      error: error,
      url: req.originalUrl,
    });
  }
});

// * Create a new user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // * Validate the user data using Joi
    const { error, value } = userRegistrationSchema.validate(req.body);

    // * Response Validation Error
    if (error) {
      res.status(400).json({
        message: "Validation Error",
        success: false,
        status: 400,
        errors: error.details,
        url: req.originalUrl,
      });
      return;
    }

    // * Check if user with same email already exists
    const userExists = await User.findOne({ email: value.email });

    if (userExists) {
      res.status(400).json({
        message: "User already exists",
        success: false,
        status: 400,
        url: req.originalUrl,
      });
      return;
    }

    // * Create Has Password using bcrypt
    const hashedPassword = await bcrypt.hash(
      value.password,
      process.env.BCRYPT_SALT_ROUND || 10
    );

    // * Update the password field with the hashed password
    value.password = hashedPassword;

    // * Create a new user using Mongoose
    const user = await User.create(value);

    // * Send a 201 response with the created user
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    // * Error Response Send
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      error: error,
    });
  }
});

// * Get Single User
export const getUserSingle = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // * Get user by ID from Mongoose
      const user = await User.findById(req.params.id);

      // * If user not found, send a 404 response
      if (!user) {
        res.status(404).json({
          message: "Data not found",
          success: false,
          status: 404,
          url: req.originalUrl,
        });
        return;
      }

      // * If user found, send a 200 response with the user
      res.status(200).json({
        data: user,
        message: "Data Get successfully",
        success: true,
        status: 200,
        url: req.originalUrl,
      });
    } catch (error) {
      // * Error Response Send
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

// * Delete User
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // * Get user by ID from Mongoose
    const user = await User.findByIdAndDelete(req.params.id);

    // * If user not found, send a 404 response
    if (!user) {
      res.status(404).json({
        message: "Data not found",
        success: false,
        status: 404,
        url: req.originalUrl,
      });
      return;
    }

    // * If user found, send a 200 response with the deleted user
    res.status(200).json({
      message: "User deleted successfully",
      success: true,
      data: user,
      url: req.originalUrl,
    });
  } catch (error) {
    // * Error Response Send
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      error: error,
      url: req.originalUrl,
    });
  }
});

// * Update User
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // * Check User Exist or not
    const userExists = await User.findById(req.params.id);

    if (!userExists) {
      res.status(404).json({
        message: "User not found",
        success: false,
        status: 404,
        url: req.originalUrl,
      });
      return;
    }

    // * Validate the user data using Joi
    const { error, value } = userRegistrationSchema.validate(req.body);

    // * Response Validation Error
    if (error) {
      res.status(400).json({
        message: "Validation Error",
        success: false,
        status: 400,
        errors: error.details,
        url: req.originalUrl,
      });
      return;
    }

    // * Get user by ID from Mongoose
    const user = await User.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    // * If user found, send a 200 response with the updated user
    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: user,
      url: req.originalUrl,
    });
  } catch (error) {
    // * Error Response Send
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
      error: error,
      url: req.originalUrl,
    });
  }
});
