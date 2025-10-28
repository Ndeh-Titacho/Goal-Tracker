import { createContext, useContext,useState, useEffect  } from "react"
import supabase from "@/Supabase/SupabaseClient";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface Task {
    goal_id: string;
    name: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    created_at: string;
    updated_at: string;
}

export interface TaskContextType {
    tasks: Task[] | null;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    createTask: (formData: Task) => Promise<void>;
    // updateTask: (taskId: string, formData: Task) => Promise<void>;
    // deleteTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

const [tasks, setTasks] = useState<Task[] | null>(null)
const [loading, setLoading] = useState<boolean>(false)
const [error, setError] = useState<string | null>(null)
const navigate = useNavigate()

const totaltask = tasks?.length || 0
const completedtask = tasks?.filter(task => task.status === "done").length || 0
const ongoingtask = tasks?.filter(task => task.status === "todo").length || 0
console.log(totaltask,completedtask,ongoingtask)


const createTask = async(formData: Task) => {
    setLoading(true)
    try {
        const taskData = {
            goal_id: formData.goal_id,
            title: formData.name,
            description: formData.description,
            status: formData.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        const { data: newTask, error: taskError } = await supabase.from("tasks").insert(taskData).select().single()
        if (taskError) {
            throw taskError
        }
        if (newTask) {
            setTasks(prevTasks => prevTasks ? [...prevTasks, newTask] : [newTask])
            toast.success("Task created successfully")
            
        }
    } catch (error: any) {
        setError(error.message)
        toast.error(error.message || "Error creating task")
        console.error("Error creating task", error)
    }
    finally {
        setLoading(false)
    }
}                                                                                       

return (
    <TaskContext.Provider value={{ tasks, loading,setLoading,  error, createTask}}>
        {children}
    </TaskContext.Provider>
)
}

export const useTask = () => {
    const context = useContext(TaskContext)
    if (context === undefined) {
        throw new Error("useTask must be used within a TaskProvider")
    }
    return context
}