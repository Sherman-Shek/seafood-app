// models/Order.js
import mongoose from "mongoose";

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

export default mongoose.model("Order", orderSchema);