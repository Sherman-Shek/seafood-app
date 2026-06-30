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

    // 處理點擊跳轉 (確保加上語言前綴)
    const handleMenuClick = (e) => {
        if (e.key === "home") navigate(`/${curLang}/`)
        if (e.key === "cart") navigate(`/${curLang}/cart`)
        if (e.key === "orders") navigate(`/${curLang}/orders`)
        if (e.key === "addSeafood") navigate(`/${curLang}/addSeafood`)
        if (e.key === "adminOrders") navigate(`/${curLang}/admin/orders`)
    }

    // 🔴 計算當前應該高亮的 Menu Key
    // 例如路徑是 /en/cart，我們把它切開變成 ['', 'en', 'cart']，取第 2 個元素
    const pathParts = location.pathname.split("/")
    const activeKey = pathParts[2] || "home" // 如果沒有第 2 個元素，代表在首頁

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
                key: 'addSeafood',
                label: <Link to={`/${curLang}/addSeafood`}>{t("addProduct")}</Link>,
            },
            {
                key: 'adminOrders',
                label: <Link to={`/${curLang}/admin/orders`}>{t("adminOrders")}</Link>,
            }
        ] : [])
    ]

    return (
        <Header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // 確保垂直居中
            padding: "10px",
            background: 'rgba(0,0,0,0.8)',
            color: "white",
            gap: "15px",
            backdropFilter: 'blur(10px)'
        }}>
            <Link to={`/${i18n.language}`} style={{ color: 'inherit' }}>
                🦐 {t("navbarTitle")}
            </Link>
        
            {/* 导航栏 */}
            <div style={{
                flex: 1,
                minWidth: "400px",
                display: "flex",
                gap: "20px",
                background: "white",
                padding: "5px 10px",
                borderRadius: "5px"
            }}>
                <Menu
                    mode="horizontal"
                    selectedKeys={[activeKey]}
                    onClick={handleMenuClick}
                    theme="light"
                    items={menuItems}
                    style={{ borderBottom: "none", width: "100%" }}
                    overflowedIndicator={null}
                />
            </div>

            {/* ✅ 登录 / 登出 */}
            <Space size="middle">
                {user ? (
                    <Space>
                        <span>{t("welcome")} 👤 {user.role}</span>
                        <Button onClick={logout}>{t("logout")}</Button>
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

