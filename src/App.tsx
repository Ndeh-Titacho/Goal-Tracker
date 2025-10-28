import {Routes, Route } from "react-router-dom"
import Auth from "./Components/Auth/Auth"
import Dashboard from "./Pages/Dashboard"
import { Toaster } from "sonner"
import DashboardLayout from "./Components/Layout/DashboardLayout"
import Members from "./Pages/Members"
import CreateGoal from "./Pages/CreateGoal"
import Goals from "./Pages/Goals"
import GoalDetails from "./Pages/GoalDetails"
import NotFound from "./Pages/NotFound"

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
