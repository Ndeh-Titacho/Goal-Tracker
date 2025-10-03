import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ModeToggle } from "../ui/mode-toggle"
import { SidebarTrigger } from "../ui/sidebar"


const Header = () => {
  return (
    <div className="p-2 w-full flex justify-between border border-b-gray-400">
      <SidebarTrigger/>
      <div className="flex gap-2">
        <ModeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default Header