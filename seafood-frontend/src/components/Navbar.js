import { Link, useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useTranslation } from "react-i18next"

function Navbar() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const { t, i18n } = useTranslation()

   
    const changeLang = (lang) => {
        const segments = location.pathname.split("/")
        segments[1] = lang // 替换语言
        navigate(segments.join("/") || `/${lang}`)
    }

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
                    <Link to={`/${i18n.language}`}>{t("home")}</Link>

                    {/* ✅ 登录后才显示 */}
                    {user?.role === "admin" && (
                        <Link to={`/${i18n.language}/add`}>
                            {t("add")}
                        </Link>
                    )} |

                    <Link to={`/${i18n.language}/cart`}>
                        {t("cart")}
                    </Link> |

                    {/* ✅ 登录 / 登出 */}
                    {user ? (
                        <>
                            <span>Welcome 👤 {user.role}</span>
                            <button onClick={logout}>{t("logout")}</button>
                        </>
                    ) : (
                        <Link to={`/${i18n.language}/login`}>
                            {t("login")}
                        </Link>
                    )}
                    <div>
                        <button onClick={() => changeLang("en")}>EN</button>
                        <button onClick={() => changeLang("zh")}>中文</button>
                    </div>
                </nav>
            </div >
        </div >
    )
}

export default Navbar

