const fs = require("fs");
const path = require("path");
const vm = require("vm");
const customStorePath = path.join(__dirname, "..", "data", "products.json");

function loadProducts() {
  const seedPath = path.join(__dirname, "..", "seed.js");
  const source = fs.readFileSync(seedPath, "utf8");
  const declaration = "const products = ";
  const start = source.indexOf(declaration);
  if (start === -1) return [];

  const arrayStart = start + declaration.length;
  const arrayEnd = source.indexOf("\n]\n", arrayStart);
  if (arrayEnd === -1) return [];

  const arraySource = source.slice(arrayStart, arrayEnd + 2);
  try {
    return vm.runInNewContext(`(${arraySource})`);
  } catch {
    return [];
  }
}

function readCustomProducts() {
  if (!fs.existsSync(customStorePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(customStorePath, "utf8"));
  } catch {
    return [];
  }
}

function writeCustomProducts(products) {
  fs.mkdirSync(path.dirname(customStorePath), { recursive: true });
  fs.writeFileSync(customStorePath, JSON.stringify(products, null, 2));
}

function getAllProducts() {
  const merged = new Map();
  loadProducts().forEach((product) => merged.set(product.slug, product));
  readCustomProducts().forEach((product) => merged.set(product.slug, product));
  return Array.from(merged.values());
}

function createProduct(product) {
  const products = readCustomProducts();
  const normalizedName = String(product.name).trim().toLowerCase();
  if (products.some((item) =>
    item.slug === product.slug ||
    item.id === product.id ||
    String(item.name).trim().toLowerCase() === normalizedName
  )) {
    const error = new Error("Product with this name already exists");
    error.code = 11000;
    throw error;
  }
  const created = {
    ...product,
    _id: product.id,
    rating: Number(product.rating) || 0,
    ratingCount: Number(product.ratingCount) || 0,
    price: Number(product.price),
    mrp: Number(product.mrp),
    inStock: product.inStock !== false,
  };
  products.unshift(created);
  writeCustomProducts(products);
  return created;
}

function updateProduct(identifier, changes) {
  const customProducts = readCustomProducts();
  const index = customProducts.findIndex((item) => item._id === identifier || item.id === identifier);
  if (index >= 0) {
    customProducts[index] = { ...customProducts[index], ...changes };
    writeCustomProducts(customProducts);
    return customProducts[index];
  }
  return null;
}

function deleteProduct(identifier) {
  const customProducts = readCustomProducts();
  const remaining = customProducts.filter((item) => item._id !== identifier && item.id !== identifier);
  if (remaining.length === customProducts.length) return false;
  writeCustomProducts(remaining);
  return true;
}

module.exports = { loadProducts, getAllProducts, createProduct, updateProduct, deleteProduct };
