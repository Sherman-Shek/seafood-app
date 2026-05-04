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
    image: { type: String, required: true },
    unit: { 
        en: { type: String, required: true },
        zh: { type: String, required: true }
    },
    cookingMethod: { 
        en: { type: String },
        zh: { type: String }
    },
    origin: { 
        en: { type: String },
        zh: { type: String }
    }
})

module.exports = mongoose.model("Seafood", seafoodSchema, "seafoods")
