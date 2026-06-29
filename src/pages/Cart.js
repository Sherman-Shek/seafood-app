import { useContext } from "react"
import { CartContext } from "../context/CartContext"

function Cart() {
  const { cart, removeFromCart, updateQty } = useContext(CartContext);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handlePlaceOrder = async () => {
    // 1. 獲取登入的 token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login！");
      return;
    }

    // 2. 📦 關鍵修復：在這裡定義並組裝 orderData！
    // (注意：請根據你實際的購物車變數名稱修改，例如是 cart 還是 cartItems)
    const orderData = {
      items: cart, // 你的購物車商品陣列
      total: totalPrice,
      createdAt: new Date()
    };

    try {
      const res = await fetch("http://localhost:5001/api/orders", {
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
      alert("Ordered fail,Please try later! Reason：" + err.message);
    }
  }

  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty!</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <div key={item.id} className="card">
              <img src={item.img} alt={item.name}/>
              <h3>{item.name}</h3>
              <p>¥{item.price} × {item.qty}</p>

              {/* 修改数量 */}
              <button onClick={() => updateQty(item._id, item.qty + 1)}>
                +
              </button>
              <button onClick={() => updateQty(item._id, item.qty - 1)}>
                -
              </button>

              {/* 删除按钮 */}
              <button
                onClick={() => {
                  removeFromCart(item._id);
                }}
              >
                Delete
              </button>
              <p></p>
            </div>
          ))}
        </div>
      )}
      <h3>Total Price: $ {totalPrice}</h3>
      <button onClick={handlePlaceOrder}>下单</button>
    </div>
  )
}

export default Cart