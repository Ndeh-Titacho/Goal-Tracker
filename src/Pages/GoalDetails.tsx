import { Button } from "@/Components/ui/button"
import { ArrowLeft, User, Calendar, Target, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import supabase from "@/Supabase/SupabaseClient"
import { Card } from "@/Components/ui/card"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { useEffect } from "react"
import type { Goal } from "@/Hooks/useGoal"
import KanbanBoard from "@/Components/Kanban/KanbanBoard"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/Components/ui/select"
import { useTask } from "@/Hooks/useTask"
import { toast } from "sonner"
import { ClipLoader } from "react-spinners"
import type { Task } from "@/Hooks/useTask"

const GoalDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [goalDetails, setGoalDetails] = useState<Goal | null>(null)
  const [formData, setFormData] = useState<Task>({
    goal_id: "",
    name: "",
    description: "",
    status: "todo",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  const { createTask, loading, setLoading } = useTask()
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchGoalDetails = async () =>{
        const { data: goal, error} = await supabase.from("goals").select("*").eq("id", id).single()
        if(goal){
            setGoalDetails(goal)
        }
        if(error){
            console.log(error)
        }
    }
    if(id){
        fetchGoalDetails()
        setFormData(prev => ({ ...prev, goal_id: id }))
    }
  }, [id])

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!formData.name){
        toast.error("Task title is required")
        return
    }
    if(!id){
        toast.error("Goal ID is missing")
        return
    }
    console.log(formData)
    await createTask(formData)
    setFormData({
        goal_id: id,
        name: "",
        description: "",
        status: "todo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    })
    setDialogOpen(false)
  }
  

  return (
    <div className="p-8 pt-20">
        <div className="flex gap-2 md:gap-8 items-center">
            <div>
                <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-green-600 hover:text-white"> <ArrowLeft /> Back</Button>
            </div>
            <div>
            <h1 className="text-3xl font-bold whitespace-nowrap">Goal Details</h1>
        </div>
        </div>

        <Card className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between px-8">
                <div>
                    <h1 className="text-2xl font-semibold">{goalDetails?.name}</h1>
                </div>
                <div className="flex gap-4 justify-start md:justify-end"> 
                    <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">{goalDetails?.status}</span>
                    <span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded-full">{goalDetails?.priority}</span>
                </div>
            </div>
            <div className="flex gap-4 px-8 text-gray-500 text-sm">
                <span className="flex gap-2">
                    <User size="20px"/> User
                </span>
                <span className="flex gap-2">
                <Calendar size="20px"/> Created {goalDetails && goalDetails.created_at ? new Date(goalDetails.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading...'}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="flex gap-2 text-lg font-semibold px-8 whitespace-nowrap items-center"><Target /> Description</h1>
                <p className="px-8 text-gray-500">{goalDetails?.description}</p>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="flex gap-2 text-lg font-semibold px-8 whitespace-nowrap items-center"><Target /> Why is it important?</h1>
                <p className="px-8 text-gray-500">{goalDetails?.why}</p>
            </div>
        </Card>

        <div className="mt-8">
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <div className="flex justify-between mt-4">
                <h2 className="text-lg font-semibold">Tasks Board</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-500"><Plus/> Add Task</Button> 
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                            <DialogDescription>
                                Add a new task to break down your goal into manageable steps.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label htmlFor="name" className="py-2">Task title</label>
                                    <Input id="name" placeholder="Task title" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2" />
                                </div>
                                <div>
                                    <label htmlFor="description" className="py-2">Task description (Optional)</label>
                                    <textarea name="" id="" className='border w-full rounded-md shadow h-25 p-2 mt-2' value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>
                                <div>
                                    <label htmlFor="status" className="py-2">Status</label>
                                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'todo' | 'in_progress' | 'done' })}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="todo">To Do</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="done">Done</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mt-4 flex gap-2 justify-end">
                                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="bg-purple-600 hover:bg-purple-500">{loading ? <ClipLoader size={20} color="white" /> : "Create Task"}</Button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
                
            </div>
            <div>
                <KanbanBoard goalId={id}/>
            </div>
        </div>
        
    </div>
  )
}

export default GoalDetails