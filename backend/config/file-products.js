const fs = require("fs");
const path = require("path");
const vm = require("vm");

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

module.exports = { loadProducts };
