import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sign from './pages/Sign'
import Login from './pages/Login'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/sign' element={<Sign />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </>
  )
}

export default App