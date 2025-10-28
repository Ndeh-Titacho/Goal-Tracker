import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../Kanban/KanbanBoard";

interface KanbanTaskProps {
    task: Task;
}

const KanbanTask = ({ task }: KanbanTaskProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none', // Important for touch devices
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 dark:bg-gray-800 bg-white border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition-shadow ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Add a dedicated drag handle for better touch control */}
      <div 
        {...listeners} 
        {...attributes}
        className="touch-none" // Prevent text selection while dragging
      >
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-200 mb-1">{task.title}</h3>
        {task.content && <p className="text-xs dark:text-gray-200 text-gray-600 mb-2">{task.content}</p>}
        {task.status && (
          <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
            {task.status.replace('_', ' ')}
          </span>
        )}
      </div>
    </div>
  );
};

export default KanbanTask;