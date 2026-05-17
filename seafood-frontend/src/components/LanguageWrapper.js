import { useEffect } from "react"
import { useParams, Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"

function LanguageWrapper() {
  const { lang } = useParams()
  const { i18n } = useTranslation()
  const supportedLangs = ["en", "zh"]

  useEffect(() => {
    if (!lang || !supportedLangs.includes(lang)) {
      i18n.changeLanguage("en")
      return
    }

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])
  return <Outlet />
}

export default LanguageWrapper