import { Outlet } from "react-router-dom"
import { SidebarProvider, } from "../ui/sidebar"
import SideBar from "../Layout/SideBar"
import Header from "./Header"
import { ThemeProvider } from "../ui/theme-provider"


const DashboardLayout = () => {
  return (
    <div>
      <ThemeProvider>

        <SidebarProvider>
          <SideBar />
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