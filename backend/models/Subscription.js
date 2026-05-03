const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionId: { type: String, required: true, unique: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    category: { type: String, enum: ["fruits", "vegetables", "combo"], required: true },
    frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    price: { type: Number, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    startDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
