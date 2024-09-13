import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: null,
  },
  profileImage: {
    default: null,
    type: String,
    required: false,
  },
  profileImagePublicId: {
    type: String, // This will store the Cloudinary public_id for image deletion
  },
});

export default mongoose.model("User", userSchema);
