import { useEffect, useState } from "react"
import { message } from "antd"

function AdminDashboard() {
    const [messageApi, contextHolder] = message.useMessage()
    const [products, setProducts] = useState([])
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")

    // 获取商品
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/seafood`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])

    // 删除
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/seafood/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (!res.ok) throw new Error("Delete failed")

            setProducts(prev => prev.filter(item => item._id !== id))
            messageApi.success("Delete successful")
        } catch (err) {
            messageApi.error(err.message)
        }
    }

    const handleAdd = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/seafood`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name, price })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            setProducts(prev => [...prev, data])
            messageApi.success("added successfully")
        } catch (err) {
            messageApi.error(err.message)
        }
    }

    const handleEdit = async (item) => {
        const newName = prompt("New name:", item.name)
        const newPrice = prompt("New price:", item.price)

        if (!newName || !newPrice) return

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/seafood/${item._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name: newName, price: newPrice })
        })

        const updated = await res.json()

        setProducts(prev =>
            prev.map(p => (p._id === item._id ? updated : p))
        )
    }

    return (
        <div style={{ padding: "20px" }}>
            {contextHolder} 
            <h1>👑 {t("adminDashboardTitle")}</h1>

            {/* ✅ 新增商品（只放一次） */}
            <div style={{ marginBottom: "20px" }}>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <button onClick={handleAdd}>{t("addProduct")}</button>
            </div>

            {/* 商品列表 */}
            {products.map(item => (
                <div key={item._id} style={{ marginBottom: "10px" }}>
                    <span>{item.name} - ${item.price}</span>

                    <button
                        onClick={() => handleDelete(item._id)}
                        style={{ marginLeft: "10px", color: "red" }}
                    >
                        {t("delete")}
                    </button>

                    <button
                        onClick={() => handleEdit(item)}
                        style={{ marginLeft: "10px" }}
                    >
                        {t("edit")}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default AdminDashboard