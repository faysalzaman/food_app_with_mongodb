import mongoose from "mongoose";
import { ObjectId } from "bson";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: ObjectId,
    ref: "Category",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  isVegetarian: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

export default mongoose.model("FoodItem", foodSchema);
