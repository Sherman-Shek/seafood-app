import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom" //  1. 引入 hook
import { getUser } from "../utils/auth"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useTranslation } from "react-i18next"
import { Card, Button, message, Row, Col, Spin } from "antd"
import { Input, Select, Space } from 'antd'
import { ShoppingCartOutlined } from "@ant-design/icons"
import axios from "axios"

const { Meta } = Card
const { Search } = Input

function SeafoodList() {
  const navigate = useNavigate() //  2. 初始化 navigate
  const [seafood, setSeafood] = useState([])
  const [loading, setLoading] = useState(true) // ✅ 修正：定義 loading 狀態
  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("low")
  const { t, i18n } = useTranslation()

  const user = getUser()
  const { addToCart } = useContext(CartContext)

  // 輔助函數：幫你判斷要顯示什麼文字
  const displayLang = (field) => {
    if (!field) return "";
    if (typeof field === 'object') {
      // 如果是新數據(物件)，根據當前語言顯示，如果沒有該語言就默認顯示英文
      return field[i18n.language] || field.en
    }
    // 如果是舊數據(字串)，直接顯示
    return field
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/seafood`)
        const data = await res.data

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
    axios.delete(`${process.env.REACT_APP_API_URL}/api/seafood/${id}`, {
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
      <h2 style={{ marginBottom: "20px" }}> {t("homeContentTitle")} 🐟</h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>

        <Space size="large" wrap>
          <Search
            placeholder={t("Search...") || "Search seafood..."}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 350 }}
            size="large"
            allowClear
          />
          <Select
            defaultValue="all"
            size="large"
            style={{ width: 140 }}
            onChange={(val) => setCategory(val)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'fish', label: 'Fish' },
              { value: 'crab', label: 'Crab' },
              { value: 'lobster', label: 'Lobster' },
              { value: 'shrimp', label: 'Shrimp' },
              { value: 'abalone', label: 'Abalone' },
              { value: 'mussel', label: 'Mussel' },
              { value: 'clam', label: 'Clam' },
              { value: 'razor clam', label: 'Razor Clam' },
              { value: 'scallop', label: 'Scallop' },
              { value: 'oyster', label: 'Oyster' },
              { value: 'whelk', label: 'Whelk' },
            ]}
          />
          <Select
            defaultValue="low"
            size="large"
            style={{ width: 180 }}
            onChange={(val) => setSort(val)}
            options={[
              { value: 'low', label: 'Price: Low-High' },
              { value: 'high', label: 'Price: High-Low' },
            ]}
          />
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {filtered.map(item => (
          <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)' // 輕微的陰影
              }}
              cover={
                <div style={{ overflow: 'hidden', height: '240px', position: 'relative' }}>
                  <img
                    crossOrigin="anonymous"
                    src={item.image}
                    alt={displayLang(item.name)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: 'transform 0.4s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              }
              actions={[
                <Button type="link"
                  onClick={() => navigate(`/${i18n.language}/seafood/${item._id}`)}
                >
                  {t("detail")}
                </Button>,

                user?.role === "admin" &&
                (<Button type="link"
                  onClick={() => navigate(`/${i18n.language}/edit/${item._id}`)}
                >
                  {t("edit")}
                </Button>
                )
              ].filter(Boolean)}
            >

              <Meta
                title={<span style={{ fontSize: '19px', fontWeight: '600' }}>{displayLang(item.name)}</span>}
                description={
                  <div style={{ marginTop: '5px' }}>
                    <span style={{ color: "#ff4d4f", fontWeight: "bold", fontSize: "22px" }}>
                      ${item.price}
                    </span>
                  </div>
                }
              />

              <Button
                type="primary"
                block
                icon={<ShoppingCartOutlined />} // 需引入圖示
                style={{ marginTop: '20px', borderRadius: '8px', height: '45px', fontSize: '16px', fontWeight: '500' }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  addToCart(item)
                  message.success(`${displayLang(item.name)} ${t("addToCart")}`)
                }}
              >
                {t("addToCart")}
              </Button>

              {user?.role === "admin" && (
                <Button
                  danger
                  block
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDelete(item._id)
                  }}
                  style={{
                    marginTop: '10px',
                    background: "#f0ad4e",
                    color: "red",
                    border: "none",
                    padding: "8px",
                    borderRadius: "8px"
                  }}>
                  {t("delete")}
                </Button>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div >
  )
}

export default SeafoodList
