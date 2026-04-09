import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import SeafoodDetail from "./components/SeafoodDetail"
import { useState } from "react"
import AddSeafood from "./pages/AddSeafood"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import EditSeafood from "./components/EditSeafood"
import Register from "./pages/Register"
import ProtectedRoute from "./ProtectedRoute"

function App() {
  const [cart] = useState([])

  return (
    <div>
      {/* 页面切换 */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit/:id" element={<EditSeafood />} />
        <Route path="/seafood/:id" element={<SeafoodDetail />} />

        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart cart={cart} />
          </ProtectedRoute>
        } />

        <Route path="/add" element={
          <ProtectedRoute>
            <AddSeafood />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}
export default App

