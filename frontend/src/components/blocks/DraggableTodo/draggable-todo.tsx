import { useSortable } from "@dnd-kit/sortable"
import { TodoCard } from "../Todo/todo-card"
import { type Todo } from "../../../types/types"
import { CSS } from "@dnd-kit/utilities";

type DraggableTodoProps = {
    todo: Todo,
    children: React.ReactNode,
    onClick: () => void,
    onKeyDown: (event: React.KeyboardEvent) => void
}

export default function DraggableTodoCard({todo, children, onClick, onKeyDown }: DraggableTodoProps) {

    const { setNodeRef, attributes, listeners, transform, isDragging, transition } = useSortable({
        id: todo.id ?? '',
        data: {
            type: 'Todo',
            todo
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        border: isDragging ? "2px dashed #ffffff" : "",
        transition
    };

    return (
        <TodoCard 
                ref={setNodeRef}
                  todo={todo}
                  onClick={onClick}
                  onKeyDown={onKeyDown}
                  {...attributes}
                  {...listeners} 
                  style={style}
                  >
            {children}
        </TodoCard>
    )
}