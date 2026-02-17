import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/auth-context'
import { TaskProvider } from './components/task-context'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <AuthProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
