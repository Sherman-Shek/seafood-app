function CartPage({ cart }) {
  return (
    <div>
      <h1>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item, index) => (
          <div key={index}>
            {item.name} - ${item.price}
          </div>
        ))
      )}
    </div>
  )
}

export default CartPage
