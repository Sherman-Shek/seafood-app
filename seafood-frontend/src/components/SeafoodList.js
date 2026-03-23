import React, { useEffect, useState } from "react"
import SeafoodForm from "./SeafoodForm"
import { Link } from "react-router-dom"

function SeafoodList() {
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
    item.name.toLowerCase().includes(search.toLowerCase())
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
          filtered.map(item =>
            item._id === id ? updatedItem : item
          )
        )
        setEditingId(null)
      })
  }

  useEffect(() => {
    fetch("http://localhost:5001/api/seafood")
      .then(res => res.json())
      .then(data => setSeafood(data))
  }, [])

  // 👉 新增后更新 UI
  const handleAdd = (newItem) => {
    setSeafood([...seafood, newItem])
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/api/seafood/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => {
        // 👉 更新 UI（关键）
        setSeafood(seafood.filter(item => item._id !== id))
      })
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

      <div>
        <button onClick={() => setCategory("all")}>All</button>
        <button onClick={() => setCategory("fish")}>Fish</button>
        <button onClick={() => setCategory("crab")}>Crab</button>
        <button onClick={() => setCategory("lobster")}>Lobster</button>
      </div>

      <div style={{ padding: "20px" }}>
        <h1>🦞 Seafood Shop</h1>

        <input
          placeholder="Search seafood..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px"
        }}>
        </div>
      </div>

      <SeafoodForm onAdd={handleAdd} />

      <h2>Seafood List 🦞</h2>

      <h2>🛒 Cart</h2>

      {cart.map((item, index) => (
        <div key={index}>
          {item.name} - ${item.price}
        </div>
      ))}

      {filtered.map(item => (
        <div key={item._id} style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "15px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>

          {editingId === item._id ? (
            <>
              <input
                name="name"
                value={editData.name}
                onChange={handleEditChange}
              />

              <input
                name="price"
                value={editData.price}
                onChange={handleEditChange}
              />

              <input
                name="description"
                value={editData.description}
                onChange={handleEditChange}
              />

              <button onClick={() => handleUpdate(item._id)}>
                💾 Save
              </button>
            </>
          ) : (
            <>
              <h3>{item.name}</h3>
              <p><b>${item.price}</b></p>
              <p>{item.description}</p>

              <Link to={`/seafood/${item._id}`}>
                <h3>{item.name}</h3>
              </Link>

              <img
                src={`/images/${item.image}`}
                alt={item.name}
                style={{ width: "10%", borderRadius: "20px" }}
              />

              <button style={{
                marginRight: "5px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "none",
                background: "#4CAF50",
                color: "white"
              }} onClick={() => startEdit(item)}>
                ✏️ Edit
              </button>

              <button style={{
                padding: "5px 10px",
                borderRadius: "5px",
                border: "none",
                background: "red",
                color: "white"
              }} onClick={() => handleDelete(item._id)}>
                ❌ Delete
              </button>

              <button onClick={() => addToCart(item)}>
                🛒 Add
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default SeafoodList
