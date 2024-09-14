import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit"; // Import rate limiting
import morgan from "morgan"; // Import morgan for request logging

import CustomError from "./utils/error.js";
import response from "./utils/response.js";
import userRoutes from "./routes/users.js";
import categoryRoutes from "./routes/category.js";
import foodRoutes from "./routes/food.js";

dotenv.config();

const app = express();

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware to handle CORS
app.use(cors());

// Middleware to enhance security by setting various HTTP headers
app.use(helmet());

// Request logging middleware
app.use(morgan("combined")); // Logs all requests to the console

// Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve files statically
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/category", categoryRoutes);

// Error Handling for 404 Not Found
app.use((req, res, next) => {
  const error = new CustomError(`No route found for ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// General error handler
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message =
    error.message ||
    "An error occurred while processing your request. Please try again later.";
  const data = error.data || null;
  const success = false;

  res.status(status).json(response(status, success, message, data));
});

// MongoDB connection function
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DRIVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

// Start the server
const PORT = process.env.PORT || 3010;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDatabase();
});

// MongoDB connection and handling requests (for serverless environments)
export default async (req, res) => {
  try {
    // Check if there's an active connection to MongoDB
    if (!mongoose.connection.readyState) {
      await connectToDatabase();
    }
    app(req, res);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    res.status(500).json({ error: "Failed to connect to database" });
  }
};
