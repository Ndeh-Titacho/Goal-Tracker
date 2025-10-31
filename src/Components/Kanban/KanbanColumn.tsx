import { useDroppable } from "@dnd-kit/core";
import type { Column } from "../Kanban/KanbanBoard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanTask from "./KanbanTask";



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

  // Define column themes based on column ID
  const getColumnTheme = (columnId: number) => {
    switch(columnId) {
      case 1: // To Do
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-700',
          hover: 'hover:bg-blue-100',
          ring: 'ring-blue-500'
        };
      case 2: // In Progress
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-400',
          text: 'text-yellow-700',
          hover: 'hover:bg-yellow-100',
          ring: 'ring-yellow-500'
        };
      case 3: // Done
        return {
          bg: 'bg-green-50',
          border: 'border-green-400',
          text: 'text-green-700',
          hover: 'hover:bg-green-100',
          ring: 'ring-green-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-400',
          text: 'text-gray-700',
          hover: 'hover:bg-gray-100',
          ring: 'ring-gray-500'
        };
    }
  };

  const theme = getColumnTheme(column.id as number);

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] p-4 rounded-lg shadow-md transition-colors ${
        isOver ? `${theme.bg} ${theme.border} border-2` : `${theme.bg} ${theme.border} border`
      }`}
    >
      <h2 className={`text-lg font-semibold mb-4 ${theme.text}`}>
        {column.title}
      </h2>
      <SortableContext 
        items={column.tasks.map(task => task.id.toString())} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[100px]">
          {column.tasks.map((task) => (
            <KanbanTask 
              key={task.id} 
              task={task} 
              theme={theme} // Pass the theme to KanbanTask
            />
          ))}
          {column.tasks.length === 0 && (
            <div className={`text-sm text-center py-4 rounded-lg border-2 border-dashed ${theme.border} ${theme.text} opacity-60`}>
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn