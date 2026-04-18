const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number
    }
  ],
  total: Number,
  status: { type: String, default: "待支付" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema)