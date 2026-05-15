const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const allowedOrigins = [
    'http://localhost:3000',
    /\.vercel\.app$/ // 🔴 這行最重要：允許所有 .vercel.app 結尾的網址（包含你的預覽網址）
]

app.use(express.json())

// 允許你的 Vercel 網址訪問後端
app.use(cors({
  origin: 'https://seafood-4pzvx1d7f-sherman-sheks-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

const path = require("path")

const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes)
const orderRoutes = require("./routes/orders")
app.use("/api/orders", orderRoutes)

app.use("/api/seafood", require("./routes/seafoodRoutes"))

const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/seafoodDB"
mongoose.connect(DB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})