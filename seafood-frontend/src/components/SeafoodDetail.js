import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useTranslation } from "react-i18next"
import { Button, message, Row, Col } from "antd"

function SeafoodDetail() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
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

  useEffect(() => {
    fetch(`http://localhost:5001/api/seafood/${id}`)
      .then(res => res.json())
      .then(data => setItem(data))
  }, [id])

  if (!item) return <p>Loading...</p>

  return (
    <div style={{ padding: "40px" }}>
      <h2>Seafood Detail</h2>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        ← Back
      </button>

      <div style={{ marginTop: "20px" }}>
        <Row gutter={40}>
          <Col span={10}>
            <img src={item.image} alt={""} style={{ width: '100%', borderRadius: '8px' }} />
          </Col>
          <Col span={14}>
            <h1>{displayLang(item.name)}</h1>
            <h2 style={{ color: '#f5222d' }}>${item.price}</h2>
            <p style={{ fontSize: '16px', margin: '20px 0' }}>{item.description}</p>
            <Button
              type="primary"
              size="large"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(item)
                message.success("Added to your cart!")
              }}
              style={{ width: '200px', height: '50px', fontSize: '18px' }}
            >
              Add To Cart
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SeafoodDetail