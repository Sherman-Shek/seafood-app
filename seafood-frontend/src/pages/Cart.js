import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useTranslation } from "react-i18next"
import { Button, message } from "antd"
import { useNavigate } from "react-router-dom"

function Cart() {
  const { i18n, t } = useTranslation()
  const { cart, removeFromCart, updateQty } = useContext(CartContext)
  const navigate = useNavigate() // ✅ 加上這行來初始化跳轉功能

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  // 輔助函數：幫你判斷要顯示什麼文字
  const displayLang = (field) => {
    if (!field) return "";
    if (typeof field === 'object') {
      // 如果是新數據(物件)，根據當前語言顯示，如果沒有該語言就默認顯示英文
      return field[i18n.language] || field.en;
    }
    // 如果是舊數據(字串)，直接顯示
    return field
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      message.warning(t("Your cart is empty"))
      return
    }
    // 1. 獲取登入的 token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login！");
      return;
    }

    // 2. 📦 關鍵修復：在這裡定義並組裝 orderData！
    // (注意：請根據你實際的購物車變數名稱修改，例如是 cart 還是 cartItems)
    const orderData = {
      items: cart.map(item => ({
        productId: item._id, // 後端 Schema 叫 productId
        name: item.name,     // 這現在是 {en, zh} 物件
        price: item.price,
        qty: item.qty
      })),
      total: totalPrice
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `伺服器報錯：${res.status}`);
      }

      const data = await res.json();
      console.log("后端返回的完整数据:", data);

      // 注意：這裡 data.orderNumber 必須是你後端回傳的物件裡有的欄位
      alert("Ordered Successfully,  ID: " + (data.orderNumber || data._id || "Done"));
      console.log("訂單詳情:", data);

      // 下单成功后清空购物车
      cart.forEach(item => removeFromCart(item._id))

    } catch (err) {
      console.error("下單出錯:", err);
      alert("Ordered fail,Please try again later! Reason：" + err.message);
    }
  }

  return (
    <div style={{ padding: "20px" }}>

      <h2>Cart</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px"
      }}>
      </div>

      {cart.length === 0 ? (
        <p>Cart is empty!</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item._id} className="card">
              <img src={item.image || item.img} alt={displayLang(item.name)} style={{ width: "100px" }} />
              <h3>{displayLang(item.name)}</h3>

              {/* ✅ 顯示產品單價 */}
              <p style={{ color: "green", fontWeight: "bold" }}>
                {t("price")}: ${item.price}
              </p>

              {/* 修改数量 */}
              <button onClick={() => updateQty(item._id, item.qty + 1)}>
                +
              </button>
              {/* ✅ 顯示目前數量 */}
              <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {item.qty}
              </span>
              <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1}>
                -
              </button>

              {/* ✅ 顯示該品項小計 (單價 x 數量) */}
              <p>Subtotal: ${item.price * item.qty}</p>

              {/* 删除按钮 */}
              <button
                onClick={() => {
                  removeFromCart(item._id);
                }}
              >
                {t("delete")}
              </button>
              <p></p>
            </div>
          ))}
        </div>
      )}
      <h3>Total Price: $ {totalPrice}</h3>

      <button onClick={handlePlaceOrder}>Order Now</button>
      <br />
      <Button
        type="primary"
        size="large"
        block
        style={{ marginTop: '20px', height: '50px', width: '200px' }}
        onClick={() => navigate(`/${i18n.language}/checkout`)}
      >
        Proceed to Checkout
      </Button>
    </div>
  )
}

export default Cart