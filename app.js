import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import CustomError from "./utils/error.js";
import response from "./utils/response.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// To serve files statically
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/user", userRoutes);

// Error Handling
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

// Start the server and connect to MongoDB
app.listen(PORT, async () => {
  try {
    const mongoConnect = await mongoose.connect(process.env.MONGO_DRIVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (mongoConnect) {
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
});
