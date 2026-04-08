const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const fs = require("fs")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const path = require("path")

const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes)
app.use("/images", express.static("public/images"))
app.use("/api/seafood", require("./routes/seafoodRoutes"))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

mongoose.connect("mongodb://127.0.0.1:27017/seafoodDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.listen(5001, ()=>{
    console.log("Server running on port 5001")
})
