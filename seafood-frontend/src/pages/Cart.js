import { useContext } from "react"
import { CartContext } from "../context/CartContext"

function Cart() {
  const { cart, removeFromCart, updateQty } = useContext(CartContext);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
      })
      const data = await response.json();
      alert("Ordered Successfully, Number:" + data.orderId)
      // 下单成功后清空购物车
      cart.forEach(item => removeFromCart(item._id))
    } catch (err) {
      console.error(err);
      alert("Try Again!")
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
              <img src={item.img} alt={item.name} />
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