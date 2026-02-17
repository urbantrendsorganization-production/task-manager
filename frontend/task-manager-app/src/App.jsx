import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

import Home from "./pages/Home"
import Sign from "./pages/Sign"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import { CoffeeFocusTimer } from "./pages/coffee-focus-timer"

import { AuthProvider } from "./components/auth-context"
import PrivateRoute from "./components/protected-route"

function App() {
  return (
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/sign" element={<Sign />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/timer"
            element={
              <PrivateRoute>
                <CoffeeFocusTimer />
              </PrivateRoute>
            }
          />
        </Routes>

        <Toaster position="top-right" richColors />
      </AuthProvider>
  )
}

export default App
