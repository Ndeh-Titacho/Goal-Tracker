import { Button } from "@/Components/ui/button"
import { Skeleton } from "@/Components/ui/skeleton";
import { useAuth } from "@/Hooks/useAuth";
import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import DashboardStats from "@/Components/Dashboard/DashboardStats";
import { useNavigate } from "react-router-dom";
import { useGoal } from "@/Hooks/useGoal";
import type { Goal } from "@/Hooks/useGoal";
import GoalsCard from "@/Components/Dashboard/GoalsCard";
import { Card } from "@/Components/ui/card";
import { Target } from "lucide-react";

interface DashboardStats {
  totalGoals: number;
  completedGoals: number;
  ongoingGoals: number;
  totalTasks: number;
  completedTasks: number;
};

const Dashboard = () => {

  const navigate = useNavigate()
  const {user,session} = useAuth()
  const {goals,fetchGoals} = useGoal()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalGoals: 0,
    completedGoals: 0,
    ongoingGoals: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  const [recentGoals, setRecentGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (!loading &&!session?.user) {
      navigate('/auth')
    }
  }, [session, navigate, loading])

  useEffect(() => {
    if(user?.id) {
      console.log("Fetching dashboard data for user:", user.id)
      setLoading(true)
      fetchGoals(user.id).finally(() => setLoading(false))
    } else {
      console.log("No user ID found for dashboard data fetch")
    }
  }, [user?.id])

  // Calculate stats whenever goals change
useEffect(() => {
  if (!goals) return;

  const totalGoals = goals.length || 0
  const completedGoals = goals.filter(goal => goal.status === "completed").length || 0
  const ongoingGoals = goals.filter(goal => goal.status === "ongoing").length || 0

  let totalTasks = 0
  let completedTasks = 0

  const recentGoalswithProgress: Goal[] = goals.map(goal => {
    const tasks = goal.Tasks || [] 
    const taskCount = tasks.length 
    const completedTaskCount = tasks.filter(task => task.status === "done").length

    totalTasks += taskCount
    completedTasks += completedTaskCount

    const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0

    return {
      id: goal.id,
      name: goal.name,
      description: goal.description || '',
      priority: goal.priority,
      status: goal.status,
      thumbnail: goal.thumbnail ?? "",
      created_at: goal.created_at,
      progress,
      task_count: taskCount
    }
  })

  setRecentGoals(recentGoalswithProgress)
  setStats({
    totalGoals,
    completedGoals,
    ongoingGoals,
    totalTasks,
    completedTasks
  })
}, [goals])
  

  if(loading) {
    return(
      <div className="flex flex-col gap-4 animate-pulse  p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />

        </div>
        <div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 pt-20">
      <div className="flex-col md:flex-row justify-between items-center ">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <h2 className="text-gray-600">Track your progress and stay motivated</h2>
        </div>
        <div className="mt-2 md:mt-0 text-right">
          <Button 
          size="lg"
          onClick={() => navigate('/goals/create')}
          className="bg-gradient-to-r from-purple-600 to-green-600 hover:scale-105 transition-transform"><Plus /> New Goal</Button>
        </div>
      </div>

      <div>
        <DashboardStats stats={stats} />
      </div>

      <div className="flex justify-between my-4">
      <h1 className="text-2xl font-semibold">Recent Goals</h1>
      <Button variant="outline"> View All</Button>
      </div>

      {recentGoals.length > 0 ? (
      <div>
      {
        recentGoals.map(goal => (
          <GoalsCard key={goal.id} goals={goal} />
        ))
      }
      </div>

    ) : (
      <Card className="flex flex-col items-center justify-center">
        <div>
          <Target className="h-20 w-20 text-gray-500" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-semibold">No goals yet</h1>
          <h2 className="text-gray-500 text-xs md:text-md">Start your journey by creating your first goal</h2>
        </div>
        <div>
          <Button size="lg" onClick={() => navigate('/goals/create')} className=" bg-gradient-to-r from-purple-600 to-green-500 hover:scale-105 transition-transform"><Plus/> Create Your First Goal</Button>
        </div>
      </Card>

    )
    }
    </div>

  )}



export default Dashboard