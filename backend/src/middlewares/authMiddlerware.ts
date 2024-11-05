// import { NextFunction, Request, Response } from "express";
// import UserModel, { IUser } from "../models/user.model";
// import { customError } from "../utils/customError";
// import jwt from "jsonwebtoken";
// import { promisify } from "util";

// const verifyToken = promisify(jwt.verify);
// const jwtSecret = process.env.JWT_SECRET;

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }
//   if(req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return next(new customError("Invalid token", 401));
//   }
//   const decodeToken = await verifyToken(token, jwtSecret as string);
//   if (!decodeToken) {
//     return next(new customError("Invalid token", 401));
//   }
//   try {
//     const user = await UserModel.findOne<IUser>({email:decodeToken.email});
//     if (!user) {
//       return res.status(401).json({ message: "You are not authorized." });
//     }
//     req.user = user;
//     next();
//     // Add additional authentication logic here, if needed
// };
