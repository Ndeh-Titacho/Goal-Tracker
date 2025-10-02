import { Button } from "@/Components/ui/button"
import { Skeleton } from "@/Components/ui/skeleton";
import { useAuth } from "@/Hooks/useAuth";
import supabase from "@/Supabase/SupabaseClient";
import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import DashboardStats from "@/Components/Dashboard/DashboardStats";

interface DashboardStats {
  totalGoals: number;
  completedGoals: number;
  ongoingGoals: number;
  totalTasks: number;
  completedTasks: number;
};

interface Goal {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'ongoing' | 'completed' | 'abandoned';
  thumbnail?: string;
  created_at: string;
  progress?: number;
  tasks_count?: number;
}

const Dashboard = () => {

  const {user} = useAuth()
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
    if( user?.id) {
      console.log("Fetching dashboard data for user:", user.id)
      setTimeout(() => { fetchDashboardData() }, (2000));
    } else {
      if(!user?.id){
        console.log("No user ID found for dashboard data fetch")
      }
      return
    }
  },[user?.id])

  const fetchDashboardData = async () => {
    try {
       const {data: goals , error: goalsError} = await supabase
       .from("goals")
       .select(`
        id,
        name,
        description,
        priority,
        thumbnail,
        status,
        created_at,
        tasks(id, status)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(6)

        if(goalsError) {
          throw goalsError
        }

        //calculate stats
        const totalGoals = goals?.length || 0
        const completedGoals = goals?.filter(goals => goals.status === "completed").length || 0
        const ongoingGoals = goals?.filter(goals => goals.status === "ongoing").length || 0

        let totalTasks = 0
        let completedTasks = 0

        const recentGoalswithProgress: Goal[] = goals?.map(goal => {
              const tasks = goal.tasks || [] 
              const taskCount = tasks.length 
              const completedTaskCount = tasks.filter(task => task.status === "done").length

              totalTasks += taskCount
              completedTasks += completedTaskCount

              const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount)) * 100 : 0

              return {
                id : goal.id,
                name: goal.name,
                description: goal.description || '',
                priority: goal.priority,
                status: goal.status,
                thumbnail: goal.thumbnail,
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
    finally{
      setLoading(false)
    }
  }

  if(loading) {
    return(
      <div className="flex flex-col gap-4 animate-pulse  p-4">
        <div className="flex gap-2">
          <Skeleton className="h-40 w-1/2" />
          <Skeleton className="h-40 w-1/2" />
          <Skeleton className="h-40 w-1/2" />
          <Skeleton className="h-40 w-1/2" />

        </div>
        <div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex-col md:flex-row justify-between items-center ">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <h2 className="text-gray-600">Track your progress and stay motivated</h2>
        </div>
        <div className="mt-2 md:mt-0 text-right">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-green-600"><Plus /> New Goal</Button>
        </div>
      </div>

      <div>
        <DashboardStats stats={stats} />
      </div>
    </div>
  )
}

export default Dashboard