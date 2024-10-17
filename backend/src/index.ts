import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "../config/connect_db";

dotenv.config();
const app = express();

// db connection
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

const startServer = () => {
  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
