import { Routes, Route, Navigate } from "react-router-dom"
import LanguageWrapper from "./components/LanguageWrapper"
import Cart from "./pages/Cart"
import SeafoodDetail from "./components/SeafoodDetail"
import { useState } from "react"
import AddSeafood from "./pages/AddSeafood"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EditSeafood from "./components/EditSeafood"
import Register from "./pages/Register"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import AdminDashboard from "./pages/AdminDashboard"
import { useTranslation } from "react-i18next"

function App() {
  const [cart] = useState([])
  const { i18n } = useTranslation()

  return (
    <AuthProvider>
      <div>
        {/* 页面切换 */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/:lang" element={<LanguageWrapper />} >
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="edit/:id" element={<EditSeafood />} />
            <Route path="seafood/:id" element={<SeafoodDetail />} />

            <Route path="cart" element={
              <ProtectedRoute>
                <Cart cart={cart} />
              </ProtectedRoute>
            } />

            <Route path="add" element={
              <ProtectedRoute>
                <AddSeafood />
              </ProtectedRoute>
            } />

            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
          </Route>

          <Route path="*" element={<Navigate to="/en" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
export default App

