
import { LayoutDashboard, User } from "lucide-react"
import { Link } from "react-router-dom"
import { SidebarContent,Sidebar, SidebarGroup,SidebarGroupLabel,SidebarGroupContent,SidebarMenu,SidebarMenuItem,SidebarMenuButton } from "../ui/sidebar"


const SideBar = () => {

  const items = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Members", url: "/members", icon: User }
  ]
  return (
    <div>
 <Sidebar collapsible="icon" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-4">
            <div >
              <div className="rounded-md h-4 w-4 bg-gradient-to-br from-purple-600 to-green-500 p-4 flex items-center justify-center text-white font-bold">GT</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Goal Tracker</div>
              </div>
              </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="py-4">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} aria-label={item.title} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    </div>
  )
}

export default SideBar
// ...existing code...