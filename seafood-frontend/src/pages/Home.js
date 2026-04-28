import SeafoodList from "../components/SeafoodList"
import { useTranslation } from "react-i18next"

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
        Premium Quality • Daily Fresh • Wild Caught <br />
        The Freshest Catch, Straight to Your Door.
      </p>
    </div>
    <SeafoodList />
  </>
}

export default Home