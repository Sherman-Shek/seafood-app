const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      productId: String,
      name: {
        en: String,
        zh: String
      },
      price: Number,
      qty: Number
    }
  ],
  total: Number,
  status: { type: String, default: "pending_payment" },
  orderNumber: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 儲存用戶關聯
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Order", orderSchema)