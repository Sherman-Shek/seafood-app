import SeafoodList from "../components/SeafoodList"
import { useTranslation } from "react-i18next"

function Home() {
  const { t } = useTranslation()

  return <>
    <h1>{t("title")} 🦞</h1>
    <SeafoodList />
  </>
}

export default Home