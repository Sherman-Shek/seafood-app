import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SeafoodPage from "./pages/SeafoodPage"
import CartPage from "./pages/CartPage"
import SeafoodDetail from "./components/SeafoodDetail"
import { useState } from "react"
import AddSeafood from "./pages/AddSeafood"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import { Navigate } from "react-router-dom"
import EditSeafood from "./components/EditSeafood";

function App() {

  function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token")
    if (!token) {
      return <Navigate to="/login" />
    }
    return children
  }
  const [cart, setCart] = useState([])

  const addToCart = (item) => {
    setCart([...cart, item])
  }
  return (
    <div>
      {/* 页面切换 */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seafood" element={<SeafoodPage addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} />} />
        <Route path="/seafood/:id" element={<SeafoodDetail />} />
        <Route path="/add" element={
          <ProtectedRoute>
            <AddSeafood />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/edit/:id" element={<EditSeafood />} />
      </Routes>
    </div>
  )
}

export default App

