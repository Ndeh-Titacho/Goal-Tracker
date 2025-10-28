import { createContext, useContext,useState, useEffect  } from "react"
import supabase from "@/Supabase/SupabaseClient";
import type { formDataType } from "../Pages/CreateGoal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface Goal {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'ongoing' | 'completed' | 'abandoned';
  thumbnail?: string;
  created_at: string;
  why?: string;
  progress?: number;
  task_count?: number;
  tasks?: {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    created_at: string;
    updated_at: string;
  }[];
}

interface GoalsContextType {
  goals: Goal[] | null;
  loading: boolean;
  error: string | null;
  recentGoals: Goal[];
  stats: DashboardStats;
  totalTasks: number;
  fetchGoals: (userId:string) => Promise<any>;
  createGoal: (formData: formDataType) => Promise<void>;
  
}

interface DashboardStats {
  totalGoals: number;
  completedGoals: number;
  ongoingGoals: number;
  totalTasks: number;
  completedTasks: number;
};

const GoalsContext = createContext<GoalsContextType | undefined>(undefined)

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [goals, setGoals] = useState<Goal[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [recentGoals, setRecentGoals] = useState<Goal[]>([]);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [stats, setStats] = useState<DashboardStats>({
    totalGoals: 0,
    completedGoals: 0,
    ongoingGoals: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  const navigate = useNavigate()

  
  const fetchGoals = async (userId:string) => {
    try {
      const { data: goals , error: goalsError } = await supabase.from("goals")
    .select(`
      id,
      name,
      description,
      priority,
      thumbnail,
      status,
      created_at,
      tasks(id, title, status, description, created_at, updated_at)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
    if (goals) {
      setGoals(goals)
      console.log(goals)
    }
    if (goalsError) {
      console.error(goalsError)
      
    }
    } catch (error) {
      console.error("Error fetching goals", error)
    }
    
  }

   // Calculate stats whenever goals change
useEffect(() => {
  if (!goals) return;

  const totalGoals = goals.length || 0
  const completedGoals = goals.filter(goal => goal.status === "completed").length || 0
  const ongoingGoals = goals.filter(goal => goal.status === "ongoing").length || 0

  let totalTasks = 0
  let completedTasks = 0

 // First calculate all the totals
goals.forEach(goal => {
  const tasks = goal.tasks || [];
  const taskCount = tasks.length;
  const completedTaskCount = tasks.filter(task => task.status === 'done').length;
  
  totalTasks += taskCount;
  completedTasks += completedTaskCount;
});

// Update the stats state
setTotalTasks(totalTasks);
setStats({
  totalGoals,
  completedGoals,
  ongoingGoals,
  totalTasks,
  completedTasks
});
console.log('Total tasks calculated:', totalTasks);

// Create the recentGoalswithProgress array with progress for each goal
const recentGoalswithProgress: Goal[] = goals.map(goal => {
  const tasks = goal.tasks || [];
  const taskCount = tasks.length;
  const completedTaskCount = tasks.filter(task => task.status === 'done').length;
  const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

  return {
    ...goal,
    progress,
    task_count: taskCount,
    completed_task_count: completedTaskCount
  };
});
  setRecentGoals(recentGoalswithProgress)
 
}, [goals])

  const createGoal = async(formData:formDataType) => {
    setLoading(true)
    try {
      const goalData = {
      user_id: formData.id,  // Map id to user_id for the database
      name: formData.name,
      description: formData.description,
      why: formData.why,
      priority: formData.priority,
      thumbnail: formData.thumbnail,
      status: formData.status
      }

      const {data: newGoal, error} = await supabase.from("goals").insert(goalData).select().single()
      if (error) {
        throw error
      } 
      if (newGoal)  {
        setGoals(prevGoals => prevGoals ? [...prevGoals, newGoal] : [newGoal])
        toast.success("Goal created successfully")
        navigate('/dashboard')
        
      }
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message || "Error creating goal")
      console.error("Error creating goal", error)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <GoalsContext.Provider value={{
      goals,
      loading,
      error,
      recentGoals,
      stats,
      totalTasks,
      fetchGoals,
      createGoal,
    }}>
      {children}
    </GoalsContext.Provider>
  )
}

export const useGoal = () => {
  const context = useContext(GoalsContext)
  if (context === undefined) {
    throw new Error("useGoal must be used within a GoalsProvider")
  }
  return context
}


