import { Button } from "@/Components/ui/button"
import { ArrowLeft, User, Calendar, Target, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import supabase from "@/Supabase/SupabaseClient"
import { Card } from "@/Components/ui/card"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import type { Goal } from "@/Hooks/useGoal"
import { CardHeader } from "@/Components/ui/card"

const GoalDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [goalDetails, setGoalDetails] = useState<Goal | null>(null)

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
    fetchGoalDetails()
  }, [id])
  

  return (
    <div className="p-8 pt-20">
        <div className="flex gap-8 items-center">
            <div>
                <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-green-600 hover:text-white"> <ArrowLeft /> Back</Button>
            </div>
            <div>
            <h1 className="text-3xl font-bold">Goal Details</h1>
        </div>
        </div>

        <Card className="mt-8">
            <div className="flex justify-between px-8">
                <div>
                    <h1 className="text-2xl font-semibold">{goalDetails?.name}</h1>
                </div>
                <div className="flex gap-4"> 
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
                <h1 className="flex gap-2 text-lg font-semibold px-8"><Target /> Description</h1>
                <p className="px-8 text-gray-500">{goalDetails?.description}</p>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="flex gap-2 text-lg font-semibold px-8"><Target /> Why is it important?</h1>
                <p className="px-8 text-gray-500">{goalDetails?.why}</p>
            </div>
        </Card>

        <div className="mt-8">
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <div className="flex justify-between mt-4">
                <h2 className="text-lg font-semibold">Tasks Board</h2>
                <Button className="bg-purple-600 hover:bg-purple-500"><Plus/> Add Task</Button>
            </div>
        </div>
        
    </div>
  )
}

export default GoalDetails