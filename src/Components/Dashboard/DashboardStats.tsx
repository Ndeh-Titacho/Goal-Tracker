import { Card, CardContent, CardHeader } from "../ui/card"
import { Target,CircleCheckBig,Clock,TrendingUp   } from 'lucide-react'
import { Progress } from "../ui/progress"

const DashboardStats = ({ stats } : { stats: 
        { totalGoals: number,
          completedGoals: number,
          totalTasks: number,
         completedTasks: number
         }}) => {

    const completionRate = stats.totalGoals > 0 ? Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0
    const taskCompletionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4 pt-6">
        <Card>
            <CardHeader className="flex justify-between">
                <div className="font-semibold">Total Goals</div>
                <div><Target /></div>
            </CardHeader>
            <CardContent className="flex flex-col">
                <div className="text-4xl font-bold">{stats.totalGoals}</div>
                <span className="text-xs text-gray-400">{stats.totalGoals} active</span>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex justify-between">
                <div className="font-semibold">Completed Goals</div>
                <div><CircleCheckBig  /></div>
            </CardHeader>
            <CardContent className="flex flex-col">
                <div className="text-4xl font-bold">{stats.completedGoals}</div>
                <span className="text-xs text-gray-400">{taskCompletionRate}% completion rate</span>
            </CardContent>
        </Card>

         <Card>
            <CardHeader className="flex justify-between">
                <div className="font-semibold">Active Tasks</div>
                <div><Clock  /></div>
            </CardHeader>
            <CardContent className="flex flex-col">
                <div className="text-4xl font-bold">{stats.totalTasks}</div>
                <span className="text-xs text-gray-400">{stats.totalTasks} total tasks</span>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex justify-between">
                <div className="font-semibold">Progress</div>
                <div><TrendingUp /></div>
            </CardHeader>
            <CardContent className="flex flex-col">
                <div className="text-4xl font-bold">{completionRate}%</div>
                <span className="mt-2"><Progress value={completionRate} /></span>
            </CardContent>
        </Card>
    </div>
  )
}

export default DashboardStats