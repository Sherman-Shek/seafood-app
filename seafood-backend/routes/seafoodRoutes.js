const express = require("express")
const router = express.Router()
const Seafood = require("../models/Seafood")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const auth = require("../middleware/auth")

// --- 1. 修正存储路径配置 ---
// 确保项目根目录下有一个 public/images 文件夹
const uploadDir = path.join(__dirname, "../public/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

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
  const seafood = await Seafood.findById(req.params.id)
  res.json(seafood)
})

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  res.json({
    imageUrl: `/images/${req.file.filename}`
  })
})

// 👉 只有登录用户可以新增商品
// CREATE seafood
router.post("/", async (req, res) => {
  try {
    const newSeafood = new Seafood(req.body)
    const saved = await newSeafood.save()
    res.json(saved)
  } catch (err) {
    res.status(500).json({ error: "保存失败" })
  }
})

router.post("/register", async (req, res) => {
  console.log("BODY 👉", req.body)

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" })
    }

    // 你的逻辑...
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/login", async (req, res) => {
  console.log("BODY 👉", req.body)
  try {
    const { email, password } = req.body
    // 这里添加你的登录验证逻辑...
    // 暂时返回一个成功标识测试
    res.json({ message: "Login success", token: "fake-token" })
  } catch (err) {
    res.status(500).json({ error: "Login failed" })
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
router.put("/:id", auth, async (req, res) => {

})

// DELETE seafood
router.delete("/:id", async (req, res) => {
  try {
    const item = await Seafood.findById(req.params.id)
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (item.image) {
      // 这里的路径要和 uploadDir 对应
      const fileName = path.basename(item.image); 
      const imagePath = path.join(uploadDir, fileName);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("✅ 图片删除成功");
      }
    }

    await Seafood.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
