const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const storePath = path.join(__dirname, "..", "data", "users.json");

function readUsers() {
  if (!fs.existsSync(storePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(storePath, "utf8"));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(users, null, 2));
}

async function findByEmail(email) {
  return readUsers().find((user) => user.email === String(email).toLowerCase()) || null;
}

async function findById(id) {
  return readUsers().find((user) => user._id === String(id)) || null;
}

async function createUser({ name, email, phone, password }) {
  const users = readUsers();
  const normalizedEmail = String(email).toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) {
    const error = new Error("User already exists");
    error.code = 11000;
    throw error;
  }

  const user = {
    _id: crypto.randomBytes(12).toString("hex"),
    name: String(name).trim(),
    email: normalizedEmail,
    phone: phone ? String(phone).trim() : "",
    password: await bcrypt.hash(password, 10),
    role: "user",
  };
  users.push(user);
  writeUsers(users);
  return user;
}

async function matchPassword(user, enteredPassword) {
  return bcrypt.compare(enteredPassword, user.password);
}

module.exports = { findByEmail, findById, createUser, matchPassword };
