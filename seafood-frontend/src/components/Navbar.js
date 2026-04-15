import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

function Navbar() {
    const { user, logout } = useContext(AuthContext)

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
                    {user?.role === "admin" && (
                        <Link to="/add">Add Seafood</Link>
                    )} |

                    <Link to="/cart">Cart</Link> |

                    {/* ✅ 登录 / 登出 */}
                    {user ? (
                        <>
                            <span>歡迎👤 {user.role}</span>
                            <button onClick={logout}>Logout</button>
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

