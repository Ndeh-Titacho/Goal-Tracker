import {Routes, Route } from "react-router-dom"
import Auth from "./Components/Auth/Auth"
import PrivateRoutes from "./Pages/PrivateRoutes"
import Dashboard from "./Pages/Dashboard"

function App() {
 

  return (
    <>
     
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Auth/>} />
          
          {/* PrivateRoutes */}
          <Route element={<PrivateRoutes/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
          </Route>
        </Routes>
     
    </>
  )
}

export default App
