import React from "react"
import ReactDOM from "react-dom/client"
<<<<<<< HEAD
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter } from "react-router-dom"
import { CartProvider } from "./context/CartContext"


=======
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import "./i18n"
//import 'antd/dist/reset.css'
import { HelmetProvider } from 'react-helmet-async'
>>>>>>> d5204add12035393f69d20dd7d8b1fa38f64ee60

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
<<<<<<< HEAD
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

=======
  <React.StrictMode>
    <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
>>>>>>> d5204add12035393f69d20dd7d8b1fa38f64ee60
