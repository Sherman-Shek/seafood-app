import { useEffect, useState } from "react"
// ✅ 1. 引入翻譯工具
import { useTranslation } from "react-i18next"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  // ✅ 2. 啟用翻譯設定
  const { t, i18n } = useTranslation()

  // ✅ 3. 加入我們熟悉的翻譯小幫手
  const displayLang = (field) => {
    if (!field) return "";
    if (typeof field === 'object') {
      return field[i18n.language] || field.en;
    }
    return field;
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>{t("loadingOrders")}</p>

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 {t("myOrders")}</h2>

      {orders.length === 0 ? (
        <p>{t("noOrders")}</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9" // 加點底色讓卡片更明顯
          }}>
            <p><b>{t("orderID")}:</b> {order._id}</p>
            <p><b>{t("orderStatus")}:</b> <span style={{ color: "orange" }}>{order.status}</span></p>
            <p><b>{t("orderTotal")}:</b> <span style={{ color: "green", fontWeight: "bold" }}>${order.total}</span></p>

            <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #ccc" }}>
              <b>{t("orderItems")}:</b>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                {order.items.map((item, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>
                    {/* ✅ 4. 用 displayLang 包住 item.name */}
                    {displayLang(item.name)} × {item.qty} (${item.price})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Orders