const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())

const path = require("path")

const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes)
const orderRoutes = require("./routes/orders")
app.use("/api/orders", orderRoutes)

app.use("/api/seafood", require("./routes/seafoodRoutes"))

mongoose.connect("mongodb://localhost:27017/seafoodDB")
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.listen(5001, ()=>{
    console.log("Server running on port 5001")
})
