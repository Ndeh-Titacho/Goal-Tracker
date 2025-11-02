import { Outlet,useNavigate } from "react-router-dom"
import { SidebarProvider, } from "../ui/sidebar"
import Header from "./Header"
import { ThemeProvider } from "../ui/theme-provider"
import { useEffect } from "react"
import supabase from "@/Supabase/SupabaseClient"
import Sidebar from "../Layout/sidebar"


const DashboardLayout = () => {
  const navigate = useNavigate()

  // useEffect( () => {
  //   const checkSession = async () => { 
  //     const {data: session, error} = await supabase.auth.getSession();
  //     if(session) {
  //       return
  //     }
  //     if(!session){
  //       navigate("/auth")
  //     }
  //     if(error){
  //       console.log(error.message)
  //     }
  //   }
  //   checkSession()
  // }, [navigate])
  
  return (
    <div>
      <ThemeProvider>

        <SidebarProvider>
          <Sidebar />
          <main className="border w-full min-h-screen">
            <Header/>
            <Outlet />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  )
}

export default DashboardLayout