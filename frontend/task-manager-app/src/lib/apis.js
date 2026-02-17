import axios from "axios"
import { toast } from "sonner"

// Create Axios instance
const api = axios.create({
  baseURL: "https://te.urbantrends.dev/",
})

// Add access token to headers automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle refresh token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 403 and not retried yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) throw new Error("No refresh token")

        // Call refresh endpoint
        const res = await axios.post(
          "https://te.urbantrends.dev/auth/token/refresh/",
          { refresh: refreshToken }
        )

        const newAccessToken = res.data.access
        localStorage.setItem("accessToken", newAccessToken)

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (err) {
        // Refresh failed → clear auth and notify
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        toast.error("Session expired. Please log in again.")
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api
