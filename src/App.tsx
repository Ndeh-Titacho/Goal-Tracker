import {Routes, Route } from "react-router-dom"
import Auth from "./components/Auth/Auth"
import Dashboard from "./pages/Dashboard"
import { Toaster } from "sonner"
import DashboardLayout from "./components/Layout/DashboardLayout"
import Members from "./pages/Members"
import CreateGoal from "./pages/CreateGoal"
import Goals from "./pages/Goals"
import GoalDetails from "./pages/GoalDetails"
import NotFound from "./pages/NotFound"

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
            <Route path="/goals/create" element={<CreateGoal />} />  
            <Route path="/goals" element={<Goals />} />
            <Route path="/goals/:id" element={<GoalDetails />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />}  />
        </Routes>

        <Toaster position="top-right" richColors />
     
    </>
  )
}

export default App
