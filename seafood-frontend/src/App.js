import { Routes, Route, Link } from "react-router-dom"

import Home from "./pages/Home"
import SeafoodPage from "./pages/SeafoodPage"
import CartPage from "./pages/CartPage"
import SeafoodDetail from "./pages/SeafoodDetail"
import { useState } from "react"


function App() {
  const [cart, setCart] = useState([])

  const addToCart = (item) => {
    setCart([...cart, item])
  }
  
  return (
    <div>
      {/* 导航栏 */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/seafood">Seafood</Link> |{" "}
        <Link to="/cart">Cart</Link>
      </nav>

      {/* 页面切换 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seafood" element={<SeafoodPage addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} />} />
        <Route path="/seafood/:id" element={<SeafoodDetail addToCart={addToCart} />} />
      </Routes>
    </div>
  )
}

export default App