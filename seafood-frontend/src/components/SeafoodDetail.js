import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { useTranslation } from 'react-i18next'
import { CartContext } from "../context/CartContext"
import { Button, message, Row, Col, Spin } from "antd"
import { Tag, Divider, Descriptions, Card, Typography } from 'antd'

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
      // 如果是新數據(物件)，根據當前語言顯示，如果沒有該語言就默認顯示英文
      return field[i18n.language] || field.en;
    }
    // 如果是舊數據(字串)，直接顯示
    return field;
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/seafood/${id}`)
      .then(res => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false); // ✅ 抓取成功後關閉
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // 發生錯誤也要關閉，避免卡死
      });
  }, [id]);

  // 2. 如果正在載入，顯示 Spin 動畫
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}>
        <Spin size="large" tip={t("Loading...")} />
      </div>
    );
  }

  // 3. 如果載入完成但沒找到資料
  if (!item) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>{t("Product not found")}</div>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
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
                  display: imgLoaded ? 'block' : 'none', // 載入前隱藏圖片避免閃爍
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

              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">{t("Origin")}: </Text>
                <Tag color="blue">{displayLang(item.origin) || t("Local")}</Tag>

                <Text type="secondary" style={{ marginLeft: '10px' }}>{t("Unit")}: </Text>
                <Tag color="green">{displayLang(item.unit) || t("pc")}</Tag>
              </div>

              <Title level={3} style={{ color: '#ff4d4f' }}>
                ${item.price}
                <small style={{ fontSize: '14px', color: '#888' }}>
                  / {displayLang(item.unit) || t("pc")}
                </small>
              </Title>
              <p />
              <Divider orientation="center">{t("Product Descriptions:")}</Divider>
              <p>{displayLang(item.description) || t("No description available.")}</p>
              <p />
              <Descriptions title={t("Buying Information:")}
                bordered
                column={1}
                size="middle"
                style={{ marginTop: '20px', background: 'white' }}
              >
                <Descriptions.Item label={t("Origin")}>
                  {displayLang(item.origin) || t("Local / Seasonal")}
                </Descriptions.Item>
                <Descriptions.Item label={t("Cooking Suggestion")}>
                  {/* 這裡顯示處理建議，例如：清蒸、椒鹽 */}
                  <Text strong style={{ color: '#1890ff' }}>
                    {displayLang(item.cookingMethod) || t("Steam / Pan-fry")}
                  </Text>
                </Descriptions.Item>
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
                  message.success(t("Added to your cart!"))
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
    </div>
  )
}

export default SeafoodDetail