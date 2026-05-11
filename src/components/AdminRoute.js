import { Navigate } from "react-router-dom"
import { getUser } from "../utils/auth"

function AdminRoute({ children }) {
  const user = getUser()

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute