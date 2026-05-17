import { Navigate, useParams } from "react-router-dom"
import { getUser } from "../utils/auth"

function ProtectedRoute({ children }) {
  const user = getUser()
  const { lang } = useParams(); // 獲取當前語言，確保跳轉回正確的登入頁

  if (!user) {
    return <Navigate to={`/${lang || 'en'}/login`} replace />
  }

  return children
}

export default ProtectedRoute