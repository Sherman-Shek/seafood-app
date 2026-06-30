import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Login.css"
import getUser from "../utils/auth"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { message } from "antd"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const { t, i18n } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      // 統一使用 axios 與環境變數，讓 Vercel 可以抓到正確的雲端後端網址
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      })

      if (res.status === 200) {
        console.log("LOGIN RESPONSE:", res.data)
        
        // 儲存 token 並更新登入狀態
        localStorage.setItem("token", res.data.token)
        login(getUser())
        
        // 導向首頁 (支援多國語系)
        navigate(`/${i18n.language}`)
      }
    } catch (err) {
      console.error(err)
      // 捕捉後端回傳的錯誤訊息 (如密碼錯誤、帳號不存在)
      const errorMessage = err.response?.data?.error || "Login failed"
      messageApi.error(errorMessage)
    }
  }

  return (
    <div className="login-container">
      {contextHolder}
      
      <h1 className="login-title">{t("loginTitle")}</h1>

      <form onSubmit={handleLogin}>
        <input 
          className="login-email" 
          onChange={e => setEmail(e.target.value)} 
          placeholder={t("email")} 
        />
        <input 
          className="login-password" 
          type="password" 
          onChange={e => setPassword(e.target.value)} 
          placeholder={t("password")} 
        />
        <button className="login-button">{t("login")}</button>
        <p>
          {t("newUser")} <br />
          <Link to={`/${i18n.language}/register`}>{t("register")}</Link>
        </p>
      </form>
    </div>
  )
}

export default Login