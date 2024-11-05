import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import UserModel from "../models/user.model";
import { customError } from "../utils/customError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// register controller
// @access public
// route --> post /api/auth/register
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    // Implement user registration logic here

    const user = await UserModel.create({ name, email, password });
    if (!user) {
      return next(new customError("Failed to register user", 400));
    }

    res
      .status(201)
      .json({ success: "true", message: "User registered successfully" });
  }
);

// login controller
// @access public
// route --> post /api/auth/login

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // Implement user login logic here
    // Use the UserModel to find the user by email and compare the password
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new customError("Invalid email or password", 401));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new customError("Invalid email or password", 401));
    }
    // Generate and send JWT token to the user

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res
      .status(200)
      .json({ success: "true", message: "User logged in successfully" });
  }
);
