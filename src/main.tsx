import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Hooks/useAuth.tsx'
import { GoalsProvider } from './Hooks/useGoal.tsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <GoalsProvider>
        <App />
      </GoalsProvider>
    </AuthProvider>
   </BrowserRouter>
  </StrictMode>,
)
