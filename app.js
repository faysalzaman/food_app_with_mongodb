import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import CustomError from "./utils/error.js";
import response from "./utils/response.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

// Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve files statically
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRoutes);

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

// MongoDB connection and handling requests
export default async (req, res) => {
  try {
    // Check if there's an active connection to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_DRIVER, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    }
    // Pass the request and response to the Express app
    app(req, res);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    res.status(500).json({ error: "Failed to connect to database" });
  }
};
