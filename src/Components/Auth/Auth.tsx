import { ThemeProvider } from "../ui/theme-provider"
import AuthTabs from "./AuthTabs"


const Auth = () => {
  return (
    <div>
      <div className="h-screen flex justify-center items-center border">
        <ThemeProvider>
        <AuthTabs/>
        </ThemeProvider>
      </div>
    </div>
  )
}

export default Auth