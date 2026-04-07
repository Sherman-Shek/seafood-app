const mongoose = require("mongoose")

const seafoodSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    image: String
})

module.exports = mongoose.model("Seafood", seafoodSchema, "seafoods")
