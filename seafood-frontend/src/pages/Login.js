import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import "./Login.css"
import getUser from "../utils/auth"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { useTranslation } from "react-i18next"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const { t, i18n } = useTranslation()


  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      })

      const data = await res.data

      if (res.status !== 200) {
        alert(data.error || "Login failed")
        return
      }
      console.log("LOGIN RESPONSE:", data)
      console.log("STATUS:", res.status)

      localStorage.setItem("token", data.token)
      login(getUser())
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Login Fail!")
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
          <Link to="/register">{t("register")}</Link>
        </p>
      </form>
    </div>
  )
}

export default Login