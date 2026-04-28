import { Link, useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useTranslation } from "react-i18next"
import { Layout, Menu, Button, Space } from "antd"
const { Header } = Layout

function Navbar() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const { t, i18n } = useTranslation()

    const curLang = i18n.language || "en"

    const changeLang = (lang) => {
        const segments = location.pathname.split("/")
        segments[1] = lang // 替换语言
        navigate(segments.join("/") || `/${lang}`)
    }
    const menuItems = [
        {
            key: 'home',
            label: <Link to={`/${curLang}`}>{t("home")}</Link>,
        },
        {
            key: 'cart',
            label: <Link to={user ? `/${curLang}/cart` : `/${curLang}/login`}>
                {t("cart")}
            </Link>,
        },
        {
            key: 'orders',
            label: <Link to={`/${i18n.language}/orders`}>{t("orders")}</Link>,
        },
        // 管理員選項
        ...(user?.role === "admin" ? [
            {
                key: 'add',
                label: <Link to={`/${curLang}/add`}>{t("add")}</Link>,
            },
            {
                key: 'admin-orders',
                label: <Link to={`/${curLang}/admin/orders`}>Admin Orders</Link>,
            }
        ] : [])
    ]

    return (
        <Header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // 確保垂直居中
            padding: "10px",
            background: "#111",
            color: "white",
            gap: "15px"
        }}>
            <Link to={`/${i18n.language}`} style={{ color: 'inherit' }}>
                🦐 Seafood Shop
            </Link>
            {/* 导航栏 */}
            <div style={{
                marginBottom: "20px", cursor: "pointer",
                display: "flex", gap: "20px", background: "white",
                color: "#333",
                padding: "5px 10px",
                borderRadius: "5px"
            }}>
                <Menu
                    mode="horizontal"
                    //theme="dark"
                    items={menuItems}
                    style={{ borderBottom: "none" }}
                />

            </div>

            {/* ✅ 登录 / 登出 */}
            <Space size="middle">
                {user ? (
                    <Space>
                        <span>{t("welcome")} 👤 {user.role}</span>                        <Button onClick={logout}>{t("logout")}</Button>
                    </Space>
                ) : (
                    <Link to={`/${i18n.language}/login`}>
                        {t("login")}
                    </Link>
                )}


                {/* 語言切換 */}
                <Space style={{ marginLeft: "10px", borderLeft: "1px solid #444", paddingLeft: "15px" }}>
                    <Button size="small" ghost onClick={() => changeLang("en")}>EN</Button>
                    <Button size="small" ghost onClick={() => changeLang("zh")}>中文</Button>
                </Space>
            </Space>
        </Header>
    )
}

export default Navbar

