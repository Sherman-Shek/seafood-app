const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors({ origin: 'https://your-vercel-domain.vercel.app' }))

const path = require("path")

const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes)
const orderRoutes = require("./routes/orders")
app.use("/api/orders", orderRoutes)

app.use("/api/seafood", require("./routes/seafoodRoutes"))

const DB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/seafoodDB"
mongoose.connect(DB_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log(err))

const PORT = process.env.PORT || 5001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
