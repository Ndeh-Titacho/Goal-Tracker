import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ModeToggle } from "../ui/mode-toggle"
import { SidebarTrigger } from "../ui/sidebar"
import { useAuth } from "@/Hooks/useAuth"
import {CircleUserRound,LogOut  } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useNavigate } from "react-router-dom"
import React from "react"

const Header = () => {
  const {user, signOut} = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/auth")
  }

  return (
    <div className="p-2 fixed top-0 left-0 right-0 z-50 dark:bg-background  bg-white border border-b-gray-200">
      <div className="w-full flex justify-between">
      <SidebarTrigger/>
      <div className="flex gap-2 items-center">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3 z-50"
          >
            <DropdownMenuLabel className="py-2 px-1">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{user?.email ?? "User"}</div>
                  <div className="text-xs text-muted-foreground">{user?.email ? "Member" : "Not signed in"}</div>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem asChild>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                  <CircleUserRound className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 focus:outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
     </div>
  )
}

export default Header