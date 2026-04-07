import React, { useEffect, useState } from "react"
import SeafoodForm from "./SeafoodForm"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"; // 👈 1. 引入 hook

function SeafoodList() {
  const navigate = useNavigate(); // 👈 2. 初始化 navigate
  const [seafood, setSeafood] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    description: ""
  })

  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("low")


  const filtered = seafood.filter(item =>
    (category === "all" || item.category === category) &&
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  )

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price)
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price)
  }

  const [cart, setCart] = useState([])

  const addToCart = (item) => {
    setCart([...cart, item])
  }


  const startEdit = (item) => {
    setEditingId(item._id)
    setEditData({
      name: item.name,
      price: item.price,
      description: item.description
    })
  }

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdate = (id) => {
    fetch(`http://localhost:5001/api/seafood/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editData)
    })
      .then(res => res.json())
      .then(updatedItem => {
        setSeafood(
          seafood.map(item =>
            item._id === id ? updatedItem : item
          )
        )
        setEditingId(null)
      })
  }

  useEffect(() => {
    fetch("http://localhost:5001/api/seafood")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data)   // 👈 看这里！
        setSeafood(data)
      })
  }, [])

  // 👉 新增后更新 UI
  const handleAdd = (newItem) => {
    setSeafood([...seafood, newItem])
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/api/seafood/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Delete failed")
        }
        return res.json()
      })
      .then(() => {
        // 👉 更新 UI（关键）
        setSeafood(prev => prev.filter(item => item._id !== id))
      })
      .catch(err => console.error("DELETE ERROR:", err))
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

      <div style={{ padding: "20px" }}>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px"
        }}>
        </div>
      </div>

      <SeafoodForm onAdd={handleAdd} />

      <div style={{ padding: "20px" }}>

        <h2 style={{ marginBottom: "20px" }}>Fresh Seafood 🐟</h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr)",
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
                    src={`http://localhost:5001${item.image}?t=${new Date().getTime()}`}
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
              </Link>

              <button onClick={(e) => {
                e.preventDefault()
              }}

                style={{
                  background: "#f0ad4e",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  borderRadius: "4px"
                }}>
                Add to Cart
              </button>

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
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}

export default SeafoodList
