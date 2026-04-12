const jwt = require("jsonwebtoken")

const SECRET = "mysecretkey"

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) return res.status(401).json({ message: "No token" })

  try {
    const decoded = jwt.verify(token, SECRET)
    req.user = decoded
    
    console.log("TOKEN:", token)
    console.log("USER:", req.user)
    
    next()
  } catch {
    res.status(401).json({ message: "Invalid token" })
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" })
  }
  next()
}

module.exports = { auth, isAdmin }