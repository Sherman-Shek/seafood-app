import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export function CartProvider({ children }) {

    // ✅ 初始化：从 localStorage 读取
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart")
        return saved ? JSON.parse(saved) : []
    })

    // ✅ 每次 cart 变化 → 存入 localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    // ➕ 添加商品
    const addToCart = (item) => {
        setCart(prev => {
            const exist = prev.find(i => i._id === item._id)

            if (exist) {
                return prev.map(i =>
                    i._id === item._id
                        ? { ...i, qty: i.qty + 1 }
                        : i
                )
            }

            return [...prev, { ...item, qty: 1 }]
        })
    }

    // ❌ 删除
    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item._id !== id))
    }

    // 🔢 修改数量
    const updateQty = (id, qty) => {
        setCart(prev =>
            prev.map(i =>
                i._id === id ? { ...i, qty } : i
            )
        )
    }
    const clearCart = () => setCart([])

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

//export default CartProvider
