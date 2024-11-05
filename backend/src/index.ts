import express, { Application, ErrorRequestHandler } from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connect_db";
import { globalErrorHandler } from "./middlewares/globalErrorHandling";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
dotenv.config();
const app: Application = express();

// db connection
connectDB();
// Define the rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests, please try again later.", // Custom message when limit is reached
});

// Apply rate limiter to all requests
app.use(limiter);
// Enable helmet to secure the Express.js app
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);

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
