import { useState, useEffect } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable"
import KanbanColumn from "./KanbanColumn";
import supabase from "@/Supabase/SupabaseClient";

export type UniqueIdentifier = string | number;

export interface Task {
  id: UniqueIdentifier;
  content: string;
  status?: 'todo' | 'in_progress' | 'done';
}

export interface Column {
  id: UniqueIdentifier;
  title: string;
  tasks: Task[];
}

interface KanbanBoardProps {
  goalId?: string;
}

const KanbanBoard = ({ goalId }: KanbanBoardProps) => {

    const [columns, setColumns] = useState<Column[]>([
        {
            id: 1,
            title: "To Do",
            tasks: []
        },
        {
            id: 2,
            title: "In Progress",
            tasks: []
        },
        {
            id: 3,
            title: "Done",
            tasks: []
        }
    ])

    // Fetch tasks from Supabase
    useEffect(() => {
        const fetchTasks = async () => {
            if (!goalId) return;
            
            const { data: tasks, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('goal_id', goalId);
            
            if (error) {
                console.error('Error fetching tasks:', error);
                return;
            }
            
            if (tasks) {
                // Map tasks to columns based on status
                const updatedColumns = columns.map(col => {
                    let statusFilter: string;
                    if (col.id === 1) statusFilter = 'todo';
                    else if (col.id === 2) statusFilter = 'in_progress';
                    else statusFilter = 'done';
                    
                    return {
                        ...col,
                        tasks: tasks
                            .filter(task => task.status === statusFilter)
                            .map(task => ({
                                id: task.id,
                                content: task.name || task.description || 'Untitled Task',
                                status: task.status
                            }))
                    };
                });
                
                setColumns(updatedColumns);
            }
        };
        
        fetchTasks();
    }, [goalId])

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event

        if (!over) return

        if(active.id === over.id) return

        setColumns((prevColumns) => {
            const newColumns = [...prevColumns]

            // find the source and destination columns
            let sourceColumn: Column | undefined
            let destinationColumn: Column | undefined
            newColumns.forEach((col) => {
                if(col.tasks.some((task) => task.id === active.id)){
                    sourceColumn = col
                }
                if(col.id === over.id || col.tasks.some((task) => task.id === over.id)){
                    destinationColumn = col
                }
            });

            if(!sourceColumn || !destinationColumn) return prevColumns

            const activeIndex = sourceColumn.tasks.findIndex((task) => task.id === active.id)
            const overIndex = destinationColumn.tasks.findIndex((task) => task.id === over.id)

            //same column drag and drop
            if ( sourceColumn.id === destinationColumn.id){
                sourceColumn.tasks = arrayMove(sourceColumn.tasks, activeIndex, overIndex)
            }
            
            //Different column drag and drop
            else {
                const [movedTask] = sourceColumn.tasks.splice(activeIndex,1)
                destinationColumn.tasks.splice(overIndex > -1 ? overIndex : destinationColumn.tasks.length, 0, movedTask)
            }
            return newColumns
        })
    }

  return (
    <div>
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-4 p-8 bg-gray-100 min-h-screen rounded-md">
                {columns.map((column) => (
                    <KanbanColumn key={column.id} column={column}/>
                ))} 
            </div>
            
        </DndContext>
    </div>
  )
}

export default KanbanBoard