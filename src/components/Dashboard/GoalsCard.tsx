import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import type { Goal } from "@/hooks/useGoal";
import { Button } from "../ui/button";
import { Calendar,Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GoalsCardProps = {
  goals: Goal;
};

const GoalsCard = ({ goals: {id, name, description, created_at, progress, task_count }}: GoalsCardProps) => {

  const navigate = useNavigate()

  return (
    <div>
       <Card className="h-76">
        <CardHeader>
         <CardTitle className="text-lg font-semibold">{name}</CardTitle>
         <CardDescription className="text-gray-500 h-15">{description}</CardDescription>
        </CardHeader>
        <CardContent>
         <div className="flex flex-col gap-2 mt-4 px-4 pb-4">
           <div className="flex justify-between items-center">
             <span className="text-sm text-gray-600">{task_count} {task_count === 1 ? 'task' : 'tasks'}</span>
             <span className="text-sm font-medium text-gray-700">{progress}%</span>
           </div>
           <Progress value={progress} className="h-2" />
         </div>
        </CardContent>
         <CardFooter className="flex justify-between">
          <div className="flex gap-2 items-center text-gray-500">
            <Calendar className="h-4 w-4" />
            <h1>{new Date(created_at).toLocaleDateString('en-US', 
              { year: 'numeric', month: 'long', day: 'numeric' })}</h1>
          </div>
          <div>
            <Button onClick={() => navigate(`/goals/${id}`)} className="bg-green-600 hover:bg-green-500">
              <Eye className="h-4 w-4" />
              View 
            </Button>
          </div>
         </CardFooter>
       </Card>
    </div>
  )
}

export default GoalsCard