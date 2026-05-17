const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // 确保你已经建立了 Order 模型
const { auth, isAdmin } = require("../middleware/auth"); // 如果需要登录才能下单

// 获取当前用户订单
// 後端讀取訂單的 API
router.get("/", auth, async (req, res) => {
  try {
    // 🔍 關鍵：這裡必須用 req.user.id 來過濾，只找這個用戶的訂單
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "獲取訂單失敗" });
  }
})

router.get("/all", auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "email")
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 处理下单的 POST 请求
// 因为在 server.js 已经定义了前缀是 /api/orders，所以这里写 "/" 即可
router.post("/", auth, async (req, res) => {
  try {
    const { items, total } = req.body;

    // 建立新订单
    const newOrder = new Order({
      user: req.user.id, // 从 auth 中间件获取用户 ID
      items: items,
      total: total,
      orderNumber: "ORD" + Date.now() // 简单生成一个编号
    })

    const savedOrder = await newOrder.save();

    // 成功后回传 JSON
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("后端的订单保存失败:", err);
    res.status(500).json({ message: "服务器保存订单失败" });
  }
})

router.put("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
