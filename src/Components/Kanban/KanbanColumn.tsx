import { useDroppable } from "@dnd-kit/core";
import type { Column } from "../Kanban/KanbanBoard";
import { SortableContext } from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanTask from "./KanbanTask";
interface KanbanColumnProps {
    column: Column
}

const KanbanColumn = ({column}: KanbanColumnProps) => {
    const {setNodeRef} = useDroppable({id: column.id})
  return (
    <div>
        <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef}>
                {
                    column.tasks.map((task) => (
                        <KanbanTask key={task.id} task={task}/>
                    ))
                }

            </div>
            
        </SortableContext>
    </div>
  )
}

export default KanbanColumn