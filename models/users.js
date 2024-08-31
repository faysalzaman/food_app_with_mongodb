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
  status: {
    type: String,
    default: "I am new!",
  },
  //   profileImage: {
  //     type: String,
  //   },
});

export default mongoose.model("User", userSchema);
