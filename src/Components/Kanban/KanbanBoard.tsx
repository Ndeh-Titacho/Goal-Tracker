import { useState, useEffect, useMemo } from "react";
import { DndContext, type DragEndEvent, useSensors, useSensor, PointerSensor, TouchSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import supabase from "@/Supabase/SupabaseClient";
import { Card } from "../ui/card";

export type UniqueIdentifier = string | number;

export interface Task {
  id: UniqueIdentifier;
  title: string;
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

  const [activeId, setActiveId] = useState<string | number | null>(null);
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
                title: task.title || 'Untitled Task',
                content: task.description || '',
                status: task.status
              }))
          };
        });
        
        setColumns(updatedColumns);
      }
    };
    
    fetchTasks();
  }, [goalId])

  const handleDragEnd = async (event: DragEndEvent) => {
    const {active, over} = event;

    if (!over) return;
    if (active.id === over.id) return;

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      
      // Find source and destination columns
      let sourceColumn: Column | undefined;
      let destinationColumn: Column | undefined;
      let sourceColumnIndex = -1;
      let destinationColumnIndex = -1;
      
      // First pass: find source and destination columns and their indices
      newColumns.forEach((col, index) => {
        if (col.tasks.some(task => task.id === active.id)) {
          sourceColumn = col;
          sourceColumnIndex = index;
        }
        // Check if we're dropping on a column (over.id is column id) or on a task
        if (col.id === over.id || col.tasks.some(task => task.id === over?.id)) {
          destinationColumn = col;
          destinationColumnIndex = index;
        }
      });

      if (!sourceColumn || destinationColumnIndex === -1) {
        console.error('Could not find source or destination column');
        return prevColumns;
      }

      const activeIndex = sourceColumn.tasks.findIndex(task => task.id === active.id);
      if (activeIndex === -1) return prevColumns;

      // If we're dropping on a column (not a task), get the column ID from the column itself
      const isDroppingOnColumn = newColumns.some(col => col.id === over.id);
      const targetColumn = isDroppingOnColumn 
        ? newColumns.find(col => col.id === over.id)
        : destinationColumn;

      if (!targetColumn) return prevColumns;

      // If source and target are the same column
      if (sourceColumn.id === targetColumn.id) {
        const overIndex = targetColumn.tasks.findIndex(task => task.id === over.id);
        if (overIndex === -1) return prevColumns;
        
        const newTasks = arrayMove([...sourceColumn.tasks], activeIndex, overIndex);
        newColumns[sourceColumnIndex] = {
          ...sourceColumn,
          tasks: newTasks
        };
      } 
      // Moving between columns
      else {
        const [movedTask] = sourceColumn.tasks.splice(activeIndex, 1);
        
        // Update the task's status based on the destination column
        let newStatus: 'todo' | 'in_progress' | 'done' = 'todo';
        if (targetColumn.id === 2) newStatus = 'in_progress';
        else if (targetColumn.id === 3) newStatus = 'done';
        
        movedTask.status = newStatus;
        
        // Find the index to insert the task in the destination column
        let insertIndex = 0;
        if (!isDroppingOnColumn) {
          const overTaskIndex = targetColumn.tasks.findIndex(task => task.id === over.id);
          if (overTaskIndex !== -1) {
            insertIndex = overTaskIndex;
          }
        }
        
        // Insert the task into the destination column
        targetColumn.tasks.splice(insertIndex, 0, movedTask);
        
        // Update the task in the database
        if (goalId) {
          supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', movedTask.id)
            .then(({ error }) => {
              if (error) {
                console.error('Error updating task status:', error);
                // Revert the UI if the database update fails
                setColumns(prevColumns);
              }
            });
        }
      }
      
      return newColumns;
    });
  }

  // Set up sensors for better touch and pointer event handling
  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // Reduced from 8px to 5px for better touch response
      delay: 150,  // Reduced delay for faster activation
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,  // Reduced from 250ms for faster response
      tolerance: 5,
    },
  })
);

  // Get all task IDs for SortableContext
  const taskIds = useMemo(() => {
    return columns.flatMap(column => 
      column.tasks.map(task => task.id.toString())
    );
  }, [columns]);

 return (
  <Card className="p-2 dark:bg-gray-800 bg-gray-100 min-h-screen">
    <DndContext 
      sensors={sensors}
      onDragStart={(event) => {
        setActiveId(event.active.id);
      }}
      onDragEnd={(event) => {
        setActiveId(null);
        handleDragEnd(event);
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto pb-4 w-full touch-auto">
        <SortableContext items={taskIds}>
          {columns.map((column) => (
            <KanbanColumn 
              key={column.id} 
              column={column}
            />
          ))}
        </SortableContext>
      </div>
      {/* ... rest of the component */}
    </DndContext>
  </Card>
);
}

export default KanbanBoard