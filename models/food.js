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
  imagePublicId: {
    // Add this field to store the Cloudinary public_id
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

foodSchema.static.availableFoods = async function () {
  return this.find({ available: true });
};

foodSchema.statics.sortAscending = async function () {
  return this.find().sort({ _id: 1 }).populate("category");
};

foodSchema.statics.sortDescending = async function () {
  return this.find().sort({ _id: -1 }).populate("category");
};

foodSchema.statics.findByField = async function (field) {
  return this.find().select(field);
};

export default mongoose.model("FoodItem", foodSchema);
