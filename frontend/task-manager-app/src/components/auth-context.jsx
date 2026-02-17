import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

// ---- helpers ----
const getStoredUser = () => {
  const u = localStorage.getItem("user")
  return u ? JSON.parse(u) : null
}

const getStoredToken = () => localStorage.getItem("accessToken")

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredToken())
  const [loading, setLoading] = useState(true) // ✅ wait for initial token check

  // ---- login ----
  const login = ({ user, accessToken, refreshToken }) => {
    if (!user || !accessToken || !refreshToken) return

    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)

    setUser(user)
    setIsAuthenticated(true)
  }

  // ---- logout ----
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")

    setUser(null)
    setIsAuthenticated(false)
  }

  // ---- sync across tabs ----
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser())
      setIsAuthenticated(!!getStoredToken())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // ---- initial load ----
  useEffect(() => {
    setLoading(false) // finished checking token
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be inside AuthProvider")
  return context
}
