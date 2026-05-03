const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    deliveryTime: { type: String, default: "Tomorrow 7AM" },
    type: { type: String, enum: ["fruit", "vegetable"], required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
