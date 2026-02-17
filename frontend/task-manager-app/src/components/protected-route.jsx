import { Navigate } from "react-router-dom"
import { useAuth } from "./auth-context"

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null // or a spinner

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}
