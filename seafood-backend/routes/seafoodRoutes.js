const express = require("express")
const router = express.Router()
const Seafood = require("../models/Seafood")
const path = require("path")
const fs = require("fs")
const { auth, isAdmin } = require("../middleware/auth")

// --- 1. 修正存储路径配置 ---

// GET all seafood
router.get("/", async (req, res) => {
  try {
    const seafood = await Seafood.find()
    res.json(seafood)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET single seafood
router.get("/:id", async (req, res) => {
  try {
    const seafood = await Seafood.findById(req.params.id)
    if (!seafood) {
      return res.status(404).json({ message: "Not found" })
    }
    res.json(seafood)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// CREATE seafood
router.post("/", auth, async (req, res) => {
  try {
    const newSeafood = new Seafood(req.body)
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: "Missing fields" })
    }
    const saved = await newSeafood.save()
    res.json(saved)
  } catch (err) {
    res.status(500).json({ error: "保存失败" })
  }
})

// UPDATE seafood
router.put("/:id", async (req, res) => {
  try {
    const updated = await Seafood.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // 返回更新后的新对象
    );
    if (!updated) return res.status(404).json({ message: "未找到该商品" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE seafood
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const item = await Seafood.findById(req.params.id)
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (item.image_public_id) {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(product.image_public_id);
      console.log("✅ 图片删除成功");
    }

    await Seafood.findByIdAndDelete(req.params.id)
    
    res.json({ message: "Deleted successfully" })
  } catch (err) {
    console.error("DELETE ERROR:", err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
