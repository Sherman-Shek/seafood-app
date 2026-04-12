import React, { useEffect, useState } from "react"
import SeafoodForm from "./SeafoodForm"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom" //  1. 引入 hook
import { getUser } from "../utils/auth"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"

function SeafoodList() {
  const navigate = useNavigate(); //  2. 初始化 navigate
  const [seafood, setSeafood] = useState([])

  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("low")

  const filtered = seafood.filter(item =>
    (category === "all" || item.category === category) &&
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  )
  const user = getUser()
  const { addToCart } = useContext(CartContext)

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price)
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price)
  }

  // 修正后的获取数据逻辑
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/seafood");
        const data = await res.json()

        // ✅ 关键点：取消注释并使用正确的 setter 函数
        setSeafood(data);
      } catch (err) {
        console.error("加载产品出错:", err)
      }
    }
    fetchProducts();
  }, []); // 确保组件加载时执行一次

  //  新增后更新 UI
  const handleAdd = (newItem) => {
    setSeafood([...seafood, newItem])
  }

  const handleDelete = (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("请先登录")
      return
    }
    fetch(`http://localhost:5001/api/seafood/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        const data = await res.json()

        if (!res.ok) {
          throw new Error(res.message || "Delete failed")
        }
        return data
      })
      .then(() => {
        //  更新 UI（关键）
        setSeafood(prev => prev.filter(item => item._id !== id))
        alert("刪除成功")
      })
      .catch(err => {
        console.error("DELETE ERROR:", err)
        alert(`删除失败：${err.message}`)
      }
      )
  }

  return (
    <div>
      <input
        placeholder="Search seafood..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select style={{ margin: "10px", padding: "5px" }}></select>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="fish">Fish</option>
        <option value="crab">Crab</option>
        <option value="lobster">Lobster</option>
      </select>

      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>

      <SeafoodForm onAdd={handleAdd} />

      <div style={{ padding: "20px" }}>

        <h2 style={{ marginBottom: "20px" }}>Fresh Seafood 🐟</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px"
        }}>

          {filtered.map(item => (
            <div key={item._id}>
              <Link
                to={`/seafood/${item._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}>

                  <img
                    crossOrigin="anonymous"
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />

                  <div style={{ padding: "15px" }}>
                    <h3>{item.name}</h3>

                    <p style={{
                      color: "green",
                      fontWeight: "bold"
                    }}>
                      ${item.price}
                    </p>
                  </div>
                </div>
                <button onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart(item)
                  alert("Added to your cart!")
                }}>
                  加入购物车
                </button>
              </Link>
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate(`/edit/${item._id}`)} // 使用反引号和正确的 navigate 语法
                  style={{
                    background: "#f0ad4e",
                    color: "black",
                    border: "none",
                    padding: "8px",
                    borderRadius: "4px"
                  }}
                >
                  Edit
                </button>
              )}

              {user?.role === "admin" && (
                <button onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDelete(item._id)
                }}

                  style={{
                    background: "#f0ad4e",
                    color: "red",
                    border: "none",
                    padding: "8px",
                    borderRadius: "4px"
                  }}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SeafoodList
