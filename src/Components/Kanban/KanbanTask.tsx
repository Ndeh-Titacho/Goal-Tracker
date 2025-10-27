import { useSortable } from "@dnd-kit/sortable";
import type { Task } from "../Kanban/KanbanBoard";
import { CSS } from "@dnd-kit/utilities";

interface KanbanTaskProps {
    task: Task
}


const KanbanTask = ({task}: KanbanTaskProps) => {
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: task.id})

    const style = {
        transform: CSS.Transform.toString(transform), CSSTransition,
    }
  return (
     <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-gray-50 border rounded-lg shadow cursor-grab"
    >
      {task.content}
    </div>
  )
}

export default KanbanTask