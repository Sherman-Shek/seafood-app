const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const fs = require("fs")
const app = express()

app.use(express.json())
app.use(cors())

const path = require("path")

app.use(express.static(path.join(__dirname, "public")))

const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes)
app.use("/images", express.static("public/images"))
app.use("/api/seafood", require("./routes/seafoodRoutes"))

mongoose.connect("mongodb://localhost:27017/seafoodDB")
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.listen(5001, ()=>{
    console.log("Server running on port 5001")
})
