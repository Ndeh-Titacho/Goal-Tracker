
import GoalsCard from "@/Components/Dashboard/GoalsCard"
import { Button } from "@/Components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGoal } from "@/Hooks/useGoal"

const Goals = () => {
  const navigate = useNavigate()
  const {recentGoals} = useGoal()
  
  return (
    <div className="p-8 pt-20">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">My Goals</h1>
            <h2 className="text-gray-600">Manage and track all your goals</h2>
        </div>
        <div>
            <Button onClick={() => navigate('/goals/create')} className="bg-gradient-to-r from-purple-600 to-green-600 hover:scale-105 transition-transform"><Plus /> New Goal</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {recentGoals && recentGoals.length > 0 ? (
          recentGoals.map((goal) => (
            <GoalsCard key={goal.id} goals={goal} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg">No goals yet. Create your first goal to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Goals