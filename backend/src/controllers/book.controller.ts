import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";

export const createBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Implement logic to create a new book
  }
);
