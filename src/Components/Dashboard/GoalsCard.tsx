import { Card } from "../ui/card"
import type { Goal } from "@/Hooks/useGoal";


type GoalsCardProps = {
  goals: Goal;
};

const GoalsCard = ({ goals: {id, name, description, priority, status, thumbnail, created_at, progress, task_count }}: GoalsCardProps) => {
  return (
    <div>
       <Card>
         <h3 className="text-lg font-semibold">{name}</h3>
         <p className="text-gray-500">{description}</p>
         <div className="flex justify-between items-center mt-4">
           <span className="text-sm text-gray-400">{created_at}</span>
           <span className="text-sm font-medium">{progress}%</span>
         </div>
       </Card>
    </div>
  )
}

export default GoalsCard