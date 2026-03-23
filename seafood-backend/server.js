const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const seafoodRoutes = require("./routes/seafoodRoutes")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/seafoodDB")
.then(()=> console.log("MongoDB Connected"))
.catch(err=>console.log(err))

app.use("/api/seafood", seafoodRoutes)

app.listen(5001, ()=>{
    console.log("Server running on port 5001")
})
