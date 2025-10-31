import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'
import { GoalsProvider } from './hooks/useGoal.tsx'
import { TaskProvider } from './hooks/useTask.tsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <GoalsProvider>
        <TaskProvider>
        <App />
        </TaskProvider>
      </GoalsProvider>
    </AuthProvider>
   </BrowserRouter>
  </StrictMode>,
)
