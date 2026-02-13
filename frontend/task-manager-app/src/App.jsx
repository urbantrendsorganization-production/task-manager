import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sign from './pages/Sign'
import Login from './pages/Login'
import { Toaster } from 'sonner'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/sign' element={<Sign />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
      <Toaster position='top-right' richColors/>
    </>
  )
}

export default App