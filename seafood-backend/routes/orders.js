const express = require("express")
const router = express.Router()

// 创建订单接口
router.post("/", async (req, res) => {
    console.log("Received order:", req.body)
    try {
        const { items } = req.body
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Cant be empty!" })
        }

        // 计算总价
        const total = items.reduce(
            (sum, item) => sum + item.price * item.qty,
            0
        )

        // 保存订单
        const newOrder = new Order({ items, total })
        const savedOrder = await newOrder.save()

        res.status(201).json({
            orderId: savedOrder._id,   // 返回订单 ID
            message: "Ordered successfully! 🎉"
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "服务器错误，请重试" })
    }
})

module.exports = router