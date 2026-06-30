import { message } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios" // 🔴 修正 1：必須引入 axios
import { useTranslation } from "react-i18next"

function Register() {
  const navigate = useNavigate()

  // 🔴 修正 2：加入 username 狀態
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { t, i18n } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  const handleRegister = async (e) => {
    // 阻止表單預設提交行為
    e.preventDefault()

    try {
      console.log("Attempting to register user...")

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        email,
        password
      })

      // 🔴 修正 3：移除 res.json() 和 res.ok，改用 axios 的正確寫法
      if (res.status === 200 || res.status === 201) {
        messageApi.success(t("registerSuccess"))
        // 跳轉登入頁面，並帶上當前語言
        navigate(`/login${i18n.language}`)

      }
    } catch (err) {
      console.log(err.response.data)
      console.error(err)
      // Axios 的錯誤訊息通常包在 err.response.data 裡面
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      messageApi.error("Registered failed: " + errorMessage)
    }
  }

  return (
    <div style={{
      maxWidth: "400px",
      margin: "100px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px"
    }}>
      {contextHolder}
      
      <h2 style={{ textAlign: "center" }}>{t("register")}</h2>

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

        {/* 🔴 修正 2：新增 username 欄位 */}
        <input
          type="text"
          placeholder={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            background: "#28a745",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {t("register")}
        </button>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}
      </form>
    </div>
  )
}

export default Register