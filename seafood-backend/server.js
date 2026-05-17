const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const allowedOrigins = [
    'http://localhost:3000',
    'https://seafood-app-seven.vercel.app', // 你的目前網址
    /\.vercel\.app$/ // 允許所有以 .vercel.app 結尾的網址
]

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: function (origin, callback) {
    // 允許沒有 origin 的請求 (例如手機 App 或 postman)
    if (!origin) return callback(null, true)
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin)
      return allowed === origin;
    })

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
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