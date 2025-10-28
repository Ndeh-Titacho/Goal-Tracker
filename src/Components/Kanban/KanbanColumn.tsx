import { useDroppable } from "@dnd-kit/core";
import type { Column } from "../Kanban/KanbanBoard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanTask from "./KanbanTask";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";

interface KanbanColumnProps {
    column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] p-4 rounded-lg shadow-md dark:bg-gray-800 bg-white transition-colors ${
        isOver ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
      <SortableContext 
        items={column.tasks.map(task => task.id.toString())} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[100px] touch-none">
          {column.tasks.map((task) => (
            <KanbanTask key={task.id} task={task} />
          ))}
          {column.tasks.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </Card>
  );
};

export default KanbanColumn