const mongoose = require("mongoose")

const seafoodSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        zh: { type: String, required: true }
    },
    category: {
        en: { type: String },
        zh: { type: String }
    },
    price: { type: Number, required: true },
    image: { type: String, required: true }
})

module.exports = mongoose.model("Seafood", seafoodSchema, "seafoods")
