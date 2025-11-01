import { Button } from '@/components/ui/button'
import {ArrowLeft,Hand,Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select,SelectContent,SelectTrigger,SelectItem, SelectValue,SelectGroup,SelectLabel } from '@/components/ui/select'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGoal } from '@/hooks/useGoal'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { useAuth } from '@/hooks/useAuth'

export interface formDataType {
    id: string,
    name: string,
    description: string,
    why:string,
    priority: string,
    thumbnail:string,
    status: string,
}

const CreateGoal = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<formDataType>({ 
    id: '',
    name: '',
    description: '',
    why: '',
    priority: '',
    thumbnail: '',
    status: 'ongoing'
  })
  const { createGoal, loading, error} = useGoal()


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!formData.name || !formData.description || !formData.why || !formData.priority ){
        toast.error("All fields are required")
        return
    }
    if(!user?.id){
        toast.error("You must be logged in to create a goal")
        return
    }
    
    createGoal({...formData, id: user.id})
    
    
  }

  return (
    <div className='pt-20 flex-col justify-center items-center'>
        <div className='py-4 px-0'>
             <div className=' flex justify-center items-center gap-4 '>
            <Button 
            variant="ghost" 
            size="lg"
            onClick={() => { navigate(-1)}}
            className='hover:bg-green-600 hover:text-white'>
                <ArrowLeft />
            </Button>
            <div>
                <h1 className='text-3xl font-bold text-nowrap'>Create New Goal</h1>
                <h2 className='text-gray-500'>Define your goal and start tracking your progress</h2>
            </div>
        </div>
        </div>
       

        <div className='flex justify-center p-4 '>
             <Card className='p-4'>
                <form onSubmit={handleSubmit} className='flex-col justify-around space-y-4'>
                    <div className='pb-4 '>
                        <h1 className='text-2xl font-semibold'>Goal Details</h1>
                    </div>
                    <div className=''> 
                        <label htmlFor="Goal Name" className='font-semibold'>Goal Name *</label>
                        <Input placeholder='e.g., Learn TypeScript, Get fit, Read 12 books' 
                          className='my-2' 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
                    </div>
                    <div>
                        <label htmlFor="Description" className='font-semibold'>Description *</label>
                        <textarea placeholder='Describe you goal and what you want to achieve...' 
                        className='border w-full rounded-md shadow h-25 p-2'
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>
                    <div>
                        <label htmlFor="why" className='font-semibold'>Why is it important?</label>
                        <Input placeholder='Explain the significance of this goal...' 
                        className='my-2'
                        value={formData.why}
                        onChange={(e) => setFormData({ ...formData, why: e.target.value })}/>
                    </div>
                    <div>
                        <label htmlFor="thumbnail" className='font-semibold'>Thumbnail (Optional)</label>
                        <Input type='file' 
                        className='my-2'
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}/>
                    </div>
                    <div>
                        <label htmlFor="priority level" className='font-semibold'>Priority Level</label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                    </div>
                    <div className='flex gap-2 items-center align-center'>
                        <input type="checkbox" name="public" id="" />
                        <label htmlFor="checkbox">Make this goal public (visible to others)</label>
                    </div>

                    <div className='flex justify-center'>
                        <Button className=' w-60 md:w-85 bg-purple-600 hover:bg-purple-500' type='submit'> <Save />{loading ? <ClipLoader/> : "Create Goal"}</Button>
                        <Button variant="outline" className='ml-2'>Cancel</Button>
                    </div>
                </form>
             </Card>
        </div>
       

        
    </div>
  )
}

export default CreateGoal