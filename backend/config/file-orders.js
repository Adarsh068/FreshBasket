const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "..", "data", "orders.json");

function readOrders() {
  if (!fs.existsSync(storePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(storePath, "utf8"));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(orders, null, 2));
}

function createOrder(order) {
  const orders = readOrders();
  const created = {
    ...order,
    _id: order.orderId,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(created);
  writeOrders(orders);
  return created;
}

function findByUserEmail(email) {
  return readOrders()
    .filter((order) => order.userEmail === String(email).toLowerCase())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findAll() {
  return readOrders();
}

module.exports = { createOrder, findByUserEmail, findAll };
