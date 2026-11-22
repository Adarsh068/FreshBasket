const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const { loadProducts, getAllProducts, createProduct, updateProduct, deleteProduct } = require("../config/file-products");

// GET /api/products - get all products (with optional type filter)
router.get("/", async (req, res) => {
  try {
    if (Product.db.readyState !== 1) {
      let products = getAllProducts();
      if (req.query.type) {
        products = products.filter((product) => product.type === req.query.type);
      }
      if (req.query.category) {
        products = products.filter((product) => product.category === req.query.category);
      }
      return res.json(products);
    }

    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/search?q=
router.get("/search", async (req, res) => {
  try {
    if (Product.db.readyState !== 1) {
      const q = String(req.query.q || "").toLowerCase();
      const products = getAllProducts().filter((product) =>
        [product.name, product.category, product.brand]
          .some((value) => String(value).toLowerCase().includes(q))
      );
      return res.json(products);
    }

    const q = req.query.q || "";
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  try {
    if (Product.db.readyState !== 1) {
      const product = getAllProducts().find((item) => item.slug === req.params.slug);
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.json(product);
    }

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - admin only
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (!req.body.name || !req.body.slug || !req.body.image) {
      return res.status(400).json({ message: "Product name, image and slug are required" });
    }
    const normalizedName = String(req.body.name).trim();
    if (Product.db.readyState === 1) {
      const escapedName = normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const duplicate = await Product.findOne({
        $or: [
          { name: { $regex: `^${escapedName}$`, $options: "i" } },
          { slug: req.body.slug },
          { id: req.body.id },
        ],
      });
      if (duplicate) {
        return res.status(400).json({ message: "A product with this name already exists" });
      }
    }
    const product = Product.db.readyState === 1
      ? await Product.create(req.body)
      : createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id - admin only
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = Product.db.readyState === 1
      ? await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      : updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - admin only
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (Product.db.readyState === 1) {
      await Product.findByIdAndDelete(req.params.id);
    } else if (!deleteProduct(req.params.id)) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
