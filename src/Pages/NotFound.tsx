import { Button } from "@/Components/ui/button"
import { useNavigate } from "react-router-dom"


const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p className="text-gray-600 mt-4">Sorry, the page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/dashboard')} className="mt-4">Back to Home</Button>
    </div>
  )
}

export default NotFound
