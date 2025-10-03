import {Routes, Route } from "react-router-dom"
import Auth from "./Components/Auth/Auth"
import PrivateRoutes from "./Pages/PrivateRoutes"
import Dashboard from "./Pages/Dashboard"
import { Toaster } from "sonner"
import DashboardLayout from "./Components/Layout/DashboardLayout"
import Members from "./Pages/Members"

function App() {
 

  return (
    <>
     
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<Auth/>} />
          
          {/* PrivateRoutes */}
          <Route element={<DashboardLayout/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/members" element={<Members />} />
          </Route>
        </Routes>

        <Toaster position="top-right" richColors />
     
    </>
  )
}

export default App
