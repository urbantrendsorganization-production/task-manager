import axios from "axios"
import { toast } from "sonner"

const api = axios.create({
  baseURL: "https://te.urbantrends.dev/",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) throw new Error("No refresh token available")

        // Call refresh endpoint
        const res = await axios.post(
          "https://te.urbantrends.dev/auth/token/refresh",
          { refresh: refreshToken }
        )

        const newAccessToken = res.data.access
        localStorage.setItem("accessToken", newAccessToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed → log out / notify
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        toast.error("Session expired. Please log in again.")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api