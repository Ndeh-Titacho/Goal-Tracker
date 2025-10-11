import { createContext, useContext,useState,  } from "react"
import supabase from "@/Supabase/SupabaseClient";
import { useAuth } from "./useAuth";
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
  progress?: number;
  task_count?: number;
  Tasks?: [
    {
      id: string;
      name: string;
      description: string;
      status: 'todo' | 'in_progress' | 'done';
      created_at: string;
      updated_at: string;
    }
  ];
}

interface GoalsContextType {
  goals: Goal[] | null;
  loading: boolean;
  error: string | null;
  fetchGoals: (userId:string) => Promise<any>;
  createGoal: (formData: formDataType) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined)

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [goals, setGoals] = useState<Goal[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
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
      tasks(id, status)`)
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
    <GoalsContext.Provider value={{ goals, fetchGoals,loading, error,createGoal }}>
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


