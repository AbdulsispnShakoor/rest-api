// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { customError } from "../utils/customError";

// TypeScript: Type assertions for error types
interface MongooseError extends Error {
  code?: number;
  keyValue?: object;
  errors?: Record<string, object>;
}

// Handle Mongoose Cast Error (Invalid ObjectId)
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new customError(message, 400);
};

// Handle Mongoose Duplicate Fields Error
const handleDuplicateFieldsDB = (err: any) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : err.message;
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new customError(message, 400);
};

// Handle Mongoose Validation Errors
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new customError(message, 400);
};

// Handle JWT Invalid Token Error
const handleJWTError = () =>
  new customError("Invalid token. Please log in again!", 401);

// Handle JWT Expired Token Error
const handleJWTExpiredError = () =>
  new customError("Your token has expired! Please log in again.", 401);

// Global error handler middleware
export const globalErrorHandler = (
  err: customError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send response for development mode
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // For production, handle specific error cases
  if (process.env.NODE_ENV === "production") {
    let error = err;

    // Handle Mongoose specific errors
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if ((err as MongooseError).code === 11000)
      error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    // Send a less detailed response in production
    return res.status(error.statusCode || 500).json({
      status: error.status,
      message: error.isOperational
        ? error.message
        : "Something went very wrong!",
    });
  }
};
