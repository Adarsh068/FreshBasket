const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOrderConfirmation({ customerName, customerPhone, orderId, items, totalAmount }) {
  try {
    let phone = customerPhone.toString().replace(/\s+/g, "");
    if (!phone.startsWith("+")) {
      phone = "+91" + phone.replace(/^0+/, "");
    }

    const itemList = items
      .map((item, i) => `  ${i + 1}. ${item.name} x${item.quantity} — ₹${item.price * item.quantity}`)
      .join("\n");

    const message = `🧺 *FreshBasket Order Confirmed!*

Hello *${customerName}* 👋

Your order has been placed successfully!

📦 *Order ID:* #${orderId}

🛒 *Items Ordered:*
${itemList}

💰 *Total Amount:* ₹${totalAmount}
🚚 *Delivery:* Within 2–4 hours
📍 *Status:* Being prepared

Thank you for choosing FreshBasket! 🍎🥦
For support: freshbasket@gmail.com`;

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phone}`,
      body: message,
    });

    console.log("✅ WhatsApp sent! SID:", response.sid);
    return { success: true, sid: response.sid };
  } catch (err) {
    console.error("❌ WhatsApp error:", err.message);
    return { success: false, error: err.message };
  }
}
async function sendSubscriptionConfirmation({ customerName, customerPhone, subscriptionId, planName, frequency, price }) {
  try {
    let phone = customerPhone.toString().replace(/\s+/g, "");
    if (!phone.startsWith("+")) {
      phone = "+91" + phone.replace(/^0+/, "");
    }

    const message = `🧺 *FreshBasket Subscription Confirmed!*

Hello *${customerName}* 👋

Your subscription has been activated successfully!

📋 *Subscription ID:* #${subscriptionId}
🥗 *Plan:* ${planName}
🔁 *Delivery:* ${frequency}
💰 *Price:* ₹${price}

Your fresh fruits & vegetables will be delivered as per your selected schedule! 🚚

Thank you for choosing FreshBasket! 🍎🥦
For support: freshbasket@gmail.com`;

    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${phone}`,
      body: message,
    });

    console.log("✅ Subscription WhatsApp sent! SID:", response.sid);
    return { success: true, sid: response.sid };
  } catch (err) {
    console.error("❌ Subscription WhatsApp error:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendOrderConfirmation, sendSubscriptionConfirmation };
