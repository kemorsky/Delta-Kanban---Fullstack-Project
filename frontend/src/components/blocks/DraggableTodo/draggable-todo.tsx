import { useSortable } from "@dnd-kit/sortable"
import { TodoCard } from "../Todo/todo-card"
import { type Todo } from "../../../types/types"
import { CSS } from "@dnd-kit/utilities";

type DraggableTodoProps = {
    todo: Todo,
    children: React.ReactNode,
    onClick: () => void,
    getTodo: (id: string) => void
}

export default function DraggableTodoCard({todo, children, onClick, getTodo}: DraggableTodoProps) {

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
        transition // TODO: WRITE MY OWN TRANSITION AND PERHAPS TRANSFORM
    };

    return (
        <TodoCard 
                getTodo={getTodo}
                ref={setNodeRef}
                  todo={todo}
                  onClick={onClick}
                  {...attributes}
                  {...listeners} 
                  style={style}
                  >
            {children}
        </TodoCard>
    )
}