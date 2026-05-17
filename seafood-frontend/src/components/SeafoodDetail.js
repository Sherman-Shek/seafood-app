import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { useTranslation } from 'react-i18next'
import { CartContext } from "../context/CartContext"
import { Button, message, Row, Col, Spin, Tag, Divider, Descriptions, Card, Typography } from "antd"
import { Helmet } from 'react-helmet-async'

const { Title, Text } = Typography

function SeafoodDetail() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)
  const { addToCart } = useContext(CartContext)

  // 輔助函數：幫你判斷要顯示什麼文字
  const displayLang = (field) => {
    if (!field) return ""
    if (typeof field === 'object') {
      return field[i18n.language] || field.en
    }
    return field
  }

  useEffect(() => {
    // 每次 id 或語言改變時，重新設為載入狀態
    setLoading(true);

    fetch(`${process.env.REACT_APP_API_URL}/api/seafood/${id}`)
      .then(res => res.json())
      .then((data) => {
        setItem(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("抓取失敗：", err)
        setLoading(false)
      })
  }, [id, i18n.language])

  // 🔴 注意：我們把原本在這裡的 if(loading) return... 刪掉了！
  // 這樣程式才會繼續往下走，讓 Helmet 能夠在一開始就被渲染出來。

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* 🔴 Helmet 永遠會被執行！即使在載入中，也能先顯示預設標題 */}
      <Helmet>
        <title>
          {item ? `${displayLang(item.name)} | 永生發海鮮` : "載入中... | 永生發海鮮"}
        </title>
        {item && (
          <>
            <meta name="description" content={`新鮮${displayLang(item.name)}，產地直送，價格為 ${item.price} 元。`} />
            <meta property="og:title" content={displayLang(item.name)} />
            <meta property="og:image" content={item.image} />
          </>
        )}
      </Helmet>

      {/* 🔴 用三元運算子來決定畫面要顯示 Spin、找不到商品，還是商品詳情 */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Spin size="large" tip={t("Loading...")} />
        </div>
      ) : !item ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>{t("Product not found")}</div>
      ) : (
        <>
          <Button
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
          </Button>

          <div style={{ marginTop: "20px" }}>
            <Row gutter={[40, 40]}>
              <Col xs={24} md={10}>
                <Card padding={0} bordered={false} shadow="sm">
                  <img
                    crossOrigin="anonymous"
                    src={item.image}
                    alt={displayLang(item.name)}
                    onLoad={() => setImgLoaded(true)}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: imgLoaded ? 'block' : 'none',
                      borderRadius: "8px",
                      objectFit: "cover",
                      transition: 'transform 0.4s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </Card>
              </Col>

              <Col xs={24} md={14}>
                <Card bordered={false} style={{ background: '#fafafa', borderRadius: '12px', overflow: 'hidden' }}>
                  <Title level={2}>{displayLang(item.name)}</Title>
                  <Title level={3} style={{ color: '#ff4d4f' }}>
                    ${item.price}
                    <small style={{ fontSize: '14px', color: '#888' }}>
                      / {displayLang(item.unit) || t("pc")}
                    </small>
                  </Title>
                  <p />
                  <Descriptions title={t("Buying Information:")}
                    bordered
                    column={1}
                    size="middle"
                    style={{ marginTop: '20px', background: 'white' }}
                  >
                    <Descriptions.Item label={t("Storage")}>
                      {i18n.language === 'zh' ? '冷藏 0-4°C' : 'Refrigerated 0-4°C'}
                    </Descriptions.Item>
                  </Descriptions>
                  <br />
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addToCart(item)
                      message.success(t("addToCart"))
                    }}
                    style={{
                      marginTop: '30px',
                      height: '55px',
                      fontSize: '20px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 10px rgba(24, 144, 255, 0.3)'
                    }}
                  >
                    🛒 {t("Add To Cart")}
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </div>
  )
}

export default SeafoodDetail