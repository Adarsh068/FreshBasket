const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  weight: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    payment: { type: String, enum: ["cod", "upi", "card"], required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["placed", "out-for-delivery", "delivered", "cancelled"],
      default: "placed",
    },
    userEmail: { type: String, default: null }, // links order to registered user
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
