import React from 'react' // 確保明確引入 React
import { Routes, Route, Navigate } from "react-router-dom"
import LanguageWrapper from "./components/LanguageWrapper"
import Cart from "./pages/Cart"
import SeafoodDetail from "./components/SeafoodDetail"
//import { useState } from "react"
import AddSeafood from "./pages/AddSeafood"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EditSeafood from "./components/EditSeafood"
import Register from "./pages/Register"

import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import AdminDashboard from "./pages/AdminDashboard"
//import { useTranslation } from "react-i18next"
import Orders from "./pages/Orders"
import AdminOrders from "./pages/AdminOrders"
import { useContext } from "react"
import { CartContext } from "./context/CartContext"
import { AuthContext } from "./context/AuthContext"
import Checkout from "./pages/Checkout"
import { HelmetProvider } from 'react-helmet-async'
import { Helmet } from "react-helmet-async"

function App() {

  const { cart } = useContext(CartContext)
  //const { i18n } = useTranslation()
  const auth = useContext(AuthContext)
  const cartContext = useContext(CartContext)
  // 如果 context 還沒準備好（預防萬一），先回傳空
  if (!auth || !cartContext) {
    return <div>Loading System...</div>;
  }

  return (
    <HelmetProvider>
      <div>

        <Helmet>
          {/* 這行是關鍵！如果子頁面沒有標題，就顯示這個 */}
          <title>永生發海鮮 | Wing Sang Fat Seafood</title>
          {/* <meta name="google-site-verification"
            content="foFaTCspkdBj-43meogkB9ZQ3EXLKLoDMM7IncWsTEk" /> */}

          <meta name="description" content="新鮮海鮮批發與零售" />
        </Helmet>

        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />

          <Route path="/:lang" element={<LanguageWrapper />} >
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="edit/:id" element={<EditSeafood />} />
            <Route path="seafood/:id" element={<SeafoodDetail />} />

            <Route path="checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            <Route path="cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />

            <Route path="addSeafood" element={
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

            <Route
              path="admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />

            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/en" replace />} />

        </Routes>

        <footer style={{ textAlign: 'center', padding: '40px', background: '#001529', color: 'white', marginTop: '50px' }}>
          <p>© 2026 Wing Sang Fat Seafood. All Rights Reserved.</p>
          <p>Location: Kowloon, Hong Kong | WhatsApp: +852 6086 3900</p>
        </footer>
      </div>
    </HelmetProvider>
  )
}
export default App

