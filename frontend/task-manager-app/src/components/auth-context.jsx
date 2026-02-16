import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

// ---- helpers ----
function getStoredUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

function getStoredToken() {
  return localStorage.getItem("accessToken")
}

// ---- provider ----
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!getStoredToken()
  )

  // ---- login ----
  const login = (response) => {
    const { user, accessToken, refreshToken } = response

    if (!user || !accessToken || !refreshToken) {
      console.error("Invalid login response", response)
      return
    }

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("user", JSON.stringify(user))

    setUser(user)
    setIsAuthenticated(true)
    navigate("/dashboard")
  }

  // ---- logout ----
  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")

    setUser(null)
    setIsAuthenticated(false)
    navigate("/login")
  }

  // ---- sync across tabs ----
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser())
      setIsAuthenticated(!!getStoredToken())
    }

    window.addEventListener("storage", handleStorageChange)
    return () =>
      window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ---- hook ----
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
