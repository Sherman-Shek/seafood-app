const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // 确保你已经建立了 Order 模型
const { auth } = require("../middleware/auth"); // 如果需要登录才能下单

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
    });

    const savedOrder = await newOrder.save();
    
    // 成功后回传 JSON
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("后端的订单保存失败:", err);
    res.status(500).json({ message: "服务器保存订单失败" });
  }
});

module.exports = router;
