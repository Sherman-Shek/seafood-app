import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { getUser } from "../utils/auth"

function Navbar() {
    const { token, logout } = useContext(AuthContext)
    const role = localStorage.getItem("role")
    const user = getUser()
    console.log("USER:", user)

    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            background: "#111",
            color: "white",
            gap: "15px"
        }}>
            <h2>🦐 Seafood Shop</h2>
            <div>
                {/* 导航栏 */}
                <nav style={{
                    marginBottom: "20px", cursor: "pointer",
                    display: "flex", gap: "20px", background: "white",
                    color: "#333",
                    padding: "5px 10px",
                    borderRadius: "5px"
                }}>
                    <Link to="/">Home</Link> |

                    {/* ✅ 登录后才显示 */}
                    {role === "admin" && (
                        <Link to="/add">Add Seafood</Link>
                    )}
                    {user && (
                        <Link to="/add">
                            Add Seafood
                        </Link>
                    )} |
                    <Link to="/cart">Cart</Link> |
                    {/* ✅ 登录 / 登出 */}
                    {user ? (
                        <>
                        <span>👤 {user.role}</span>
                        <button onClick={() => {
                            localStorage.removeItem("token")
                            window.location.reload()
                        }}>
                            Logout
                        </button>
                        </>
                    ) : (
                        <Link to="/login" style={{ color: "red" }}>
                            Login
                        </Link>
                    )}
                </nav>
            </div >
        </div >
    )
}

export default Navbar

