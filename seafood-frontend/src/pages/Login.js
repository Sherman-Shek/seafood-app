import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "./Login.css"

function Login() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      login(data.token) // ⭐ 核心

      navigate("/")
    } catch (err) {
      alert("登录失败：" + err.message)
    }
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <form onSubmit={handleLogin}>
        <input className="login-email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="login-password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button className="login-button">Login</button>
        <p>
          New here? <br />
          <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  )
}

export default Login