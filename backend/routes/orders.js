const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");
const { sendOrderConfirmation } = require("../utils/whatsapp");
const fileOrders = require("../config/file-orders");
const Product = require("../models/Product");
const { loadProducts } = require("../config/file-products");

// POST /api/orders - place new order

router.post("/", protect, async (req, res) => {
  try {
    const { customerName, phone, address, city, pincode, payment } = req.body;
    if (!address || !city || !pincode || !payment) {
      return res.status(400).json({ message: "Address, city, pincode and payment method are required" });
    }
    if (payment !== "cod") {
      return res.status(400).json({ message: "UPI and card payments are coming soon. Please use Cash on Delivery" });
    }
    if (!/^[0-9]{6}$/.test(String(pincode || ""))) {
      return res.status(400).json({ message: "Enter a valid 6-digit pincode" });
    }
    if (!/^$|^[0-9]{10}$/.test(String(phone || ""))) {
      return res.status(400).json({ message: "Enter a valid 10-digit phone number" });
    }
    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one product" });
    }

    const requested = new Map();
    for (const item of req.body.items) {
      if (!item || typeof item.id !== "string") {
        return res.status(400).json({ message: "Invalid order item" });
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ message: "Invalid product quantity" });
      }
      requested.set(item.id, (requested.get(item.id) || 0) + quantity);
    }

    let trustedProducts;
    if (Product.db.readyState === 1) {
      trustedProducts = await Product.find({ id: { $in: [...requested.keys()] } });
    } else {
      trustedProducts = loadProducts().filter((product) => requested.has(product.id));
    }

    if (trustedProducts.length !== requested.size) {
      return res.status(400).json({ message: "One or more products are unavailable" });
    }

    const items = trustedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      price: Number(product.price),
      quantity: requested.get(product.id),
      weight: product.weight,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 499 ? 0 : 29;
    const total = subtotal + deliveryFee;

    const unavailable = trustedProducts.find((product) => product.inStock === false);
    if (unavailable) return res.status(400).json({ message: "One or more products are out of stock" });

    const orderId = "FB" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const userEmail = req.user.email;
    const userName = req.user.name;
    const userPhone = req.user.phone || String(phone || "");
    const orderPayload = {
      orderId,
      customerName: userName || String(customerName || "").trim(),
      phone: userPhone,
      address: String(address).trim(),
      city: String(city).trim(),
      pincode: String(pincode).trim(),
      payment,
      items,
      subtotal,
      deliveryFee,
      total,
      status: "placed",
      userEmail,
    };

    let order;
    if (Order.db.readyState === 1) {
      order = await Order.create(orderPayload);
    } else {
      order = fileOrders.createOrder(orderPayload);
    }


    // ✅ Send WhatsApp confirmation
    if (userPhone) {
      await sendOrderConfirmation({
        customerName: userName || "Customer",
        customerPhone: userPhone,
        orderId,
        items,
        totalAmount: total,
      });
    } else {
      console.log("❌ WhatsApp skipped — no phone number found")
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/user/mine - logged-in user sees their own orders
router.get("/user/mine", protect, async (req, res) => {
  try {
    const orders = Order.db.readyState === 1
      ? await Order.find({ userEmail: req.user.email }).sort({ createdAt: -1 })
      : fileOrders.findByUserEmail(req.user.email);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - admin: all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status - admin only
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/orders/:id - admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Order.findOneAndDelete({ orderId: req.params.id });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;