import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../Kanban/KanbanBoard";


interface KanbanTaskProps {
    task: Task;
    theme?: {
        bg?: string;
        border?: string;
        text?: string;
        hover?: string;
        ring?: string;
    };
}

const KanbanTask = ({ task, theme = {} }: KanbanTaskProps) => {
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
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-3 bg-white border rounded-lg shadow transition-all ${
                theme.border || 'border-gray-200'
            } ${isDragging ? `ring-2 ${theme.ring || 'ring-blue-500'}` : ''} ${
                theme.hover || 'hover:bg-gray-50'
            }`}
        >
            <div 
                {...listeners} 
                {...attributes}
                className="cursor-grab active:cursor-grabbing"
            >
                <h3 className={`font-semibold text-sm mb-1 ${theme.text || 'text-gray-900'}`}>
                    {task.title}
                </h3>
                {task.content && <p className="text-xs text-gray-600 mb-2">{task.content}</p>}
                {task.status && (
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                        theme.bg || 'bg-gray-100'
                    } ${theme.text || 'text-gray-700'}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                )}
            </div>
        </div>
    );
};
export default KanbanTask;