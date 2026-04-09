import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registered failed!")
      }

      alert("Registered Successfully！ Please Login")

      // 👉 跳转登录页
      navigate("/login")

    } catch (err) {
      console.error(err)
      setError(err.message)
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
      <h2 style={{ textAlign: "center" }}>Register</h2>

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
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
            borderRadius: "5px"
          }}
        >
          Register
        </button>

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}
      </form>
    </div>
  )
}

export default Register