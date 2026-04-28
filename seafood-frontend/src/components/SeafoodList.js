import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom" //  1. 引入 hook
import { getUser } from "../utils/auth"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useTranslation } from "react-i18next"
import { Card, Button, message, Row, Col, Spin } from "antd"

function SeafoodList() {
  const { i18n } = useTranslation()
  const navigate = useNavigate() //  2. 初始化 navigate
  const [seafood, setSeafood] = useState([])
  const [loading, setLoading] = useState(true) // ✅ 修正：定義 loading 狀態
  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("low")
  const { Meta } = Card

  const user = getUser()
  const { addToCart } = useContext(CartContext)

  // 輔助函數：幫你判斷要顯示什麼文字
  const displayLang = (field) => {
    if (!field) return "";
    if (typeof field === 'object') {
      // 如果是新數據(物件)，根據當前語言顯示，如果沒有該語言就默認顯示英文
      return field[i18n.language] || field.en;
    }
    // 如果是舊數據(字串)，直接顯示
    return field;
  }

  const filtered = seafood.filter(item => {
    console.log("Current Category Selection:", category, "First Item Category:", seafood[0]?.category);
    // 取得當前語言對應的名稱，如果是舊數據字串則直接用
    const currentName = typeof item.name === 'object'
      ? (i18n.language === 'zh' ? item.name.zh : item.name.en)
      : item.name;

    const matchesCategory = (category === "all" ||
      (typeof item.category === 'object' ? item.category.en === category : item.category === category));

    const matchesSearch = (currentName || "").toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  })

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
        message.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts();
  }, []); // 确保组件加载时执行一次

  //  新增后更新 UI
  // const handleAdd = (newItem) => {
  //   setSeafood([...seafood, newItem])
  // }

  const handleDelete = (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first!")
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
        message.success("Deleted Successfully!")
      })
      .catch(err => {
        console.error("DELETE ERROR:", err)
        message.error(`Deleted Fail!：${err.message}`)
      }
      )
  }
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Fresh Seafood 🐟</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          placeholder="Search seafood..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "5px" }}
        />

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
      </div>

      <Row gutter={[16, 16]}>
        {filtered.map(item => (
          <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
            <Card
              hoverable
              cover={
                <img
                  crossOrigin="anonymous"
                  src={item.image}
                  alt={displayLang(item.name)}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              }
              actions={[
                <Button type="link"
                  onClick={() => navigate(`/${i18n.language}/seafood/${item._id}`)}
                >
                  Detail
                </Button>,

                user?.role === "admin" &&
                (<Button type="link"
                  onClick={() => navigate(`/${i18n.language}/edit/${item._id}`)}
                >
                  Edit
                </Button>
                )
              ].filter(Boolean)}
            >

              <Meta
                title={displayLang(item.name)}
                style={{
                  color: "green",
                  fontWeight: "bold"
                }}
                description={
                  <span style={{ color: "#ff4d4f", fontWeight: "bold", fontSize: "16px" }}>
                    ${item.price}
                  </span>
                }
              />

              <div style={{ marginTop: "10px" }}>
                <Button type="primary"
                  block
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addToCart(item)
                    message.success("Added to your cart!")
                  }}>
                  Add To Cart
                </Button>

                {user?.role === "admin" && (
                  <Button
                    danger
                    onClick={(e) => {
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
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default SeafoodList
