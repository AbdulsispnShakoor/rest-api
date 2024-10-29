import express, { Application, ErrorRequestHandler } from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connect_db";
import { globalErrorHandler } from "./middlewares/globalErrorHandling";

dotenv.config();
const app: Application = express();

// db connection
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.use(globalErrorHandler as ErrorRequestHandler);

const startServer = () => {
  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
