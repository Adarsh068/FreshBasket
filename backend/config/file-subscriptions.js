const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "..", "data", "subscriptions.json");

function readSubscriptions() {
  if (!fs.existsSync(storePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(storePath, "utf8"));
  } catch {
    return [];
  }
}

function writeSubscriptions(subscriptions) {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(subscriptions, null, 2));
}

function createSubscription(subscription) {
  const subscriptions = readSubscriptions();
  const created = {
    ...subscription,
    _id: subscription.subscriptionId,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  subscriptions.unshift(created);
  writeSubscriptions(subscriptions);
  return created;
}

module.exports = { readSubscriptions, createSubscription };
