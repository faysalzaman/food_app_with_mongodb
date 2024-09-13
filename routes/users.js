import express from "express";
import multerUpload from "../config/multer_cloudinary.js";
import {
  createUser,
  login,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/users.js";

const router = express.Router();

// Route to create a user
router.post("/v1/createUser", multerUpload.single("image"), createUser);

// Route for user login
router.post("/v1/login", login);

// Route to update a user by userId
router.put("/v1/users/:userId", multerUpload.single("image"), updateUser);

// Route to delete a user by userId
router.delete("/v1/users/:userId", deleteUser);

// Route to get all users
router.get("/v1/users", getAllUsers);

export default router;
