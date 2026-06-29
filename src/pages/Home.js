import SeafoodList from "../components/SeafoodList"
import { useTranslation } from "react-i18next"
import { Button } from "antd"
import { WhatsAppOutlined } from '@ant-design/icons'

function Home() {
  const { t } = useTranslation()

  return <>
    <div style={{ padding: "0 40px 40px" }}></div>
    <div style={{
      background: '#001529',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      borderRadius: '12px',
      marginBottom: '40px'
    }}>
      <h1 style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', marginBottom: '10px' }}
      >
        {t("title")} 🦞
      </h1>
      <p style={{ fontSize: '20px', letterSpacing: '1px' }}>
        {t("siteKeywords")}
      </p>
    </div>
    <a
      href="https://wa.me/85260863900"
      target="_blank"
      rel="noopener noreferrer"
      style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
    >
      <Button type="primary" shape="circle" icon={<WhatsAppOutlined />} size="large" style={{ backgroundColor: '#25D366', borderColor: '#25D366', height: '60px', width: '60px' }} />
    </a>
    <SeafoodList />
  </>
}

export default Home