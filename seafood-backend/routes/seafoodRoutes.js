const express = require("express")
const router = express.Router()

const Seafood = require("../models/Seafood")

// GET all seafood
router.get("/", async (req,res)=>{
    console.log("API HIT")
    const seafood = await Seafood.find()
    console.log("DATA:", seafood)
    res.json(seafood)
})

// GET single seafood
router.get("/:id", async (req,res)=>{
    const seafood = await Seafood.findById(req.params.id)
    res.json(seafood)
})

// CREATE seafood
router.post("/", async (req,res)=>{
    const newSeafood = new Seafood(req.body)
    const saved = await newSeafood.save()
    res.json(saved)
})

// UPDATE seafood
router.put("/:id", async (req,res)=>{
    const updated = await Seafood.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.json(updated)
})

// DELETE seafood
router.delete("/:id", async (req,res)=>{
    await Seafood.findByIdAndDelete(req.params.id)
    res.json({message:"Deleted"})
})

module.exports = router
