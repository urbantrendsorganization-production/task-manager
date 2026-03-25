import React from "react"
import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

import Home from "./pages/Home"
import Sign from "./pages/Sign"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import { CoffeeFocusTimer } from "./pages/coffee-focus-timer"
import OAuthCallback from "./pages/OAuthCallback"

import PrivateRoute from "./components/protected-route"

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback/:provider" element={<OAuthCallback />} />

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
    </>
  )
}

export default App
