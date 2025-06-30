import { useDraggable } from "@dnd-kit/core"
import { TodoCard } from "../Todo/todo-card"
import { type Todo } from "../../../types/types"
import { CSS } from "@dnd-kit/utilities";

type DraggableTodoProps = {
    todo: Todo,
    children: React.ReactNode,
    onClick: () => void
}

export default function DraggableTodoCard({todo, children, onClick}: DraggableTodoProps) {

    const { setNodeRef, attributes, listeners, transform } = useDraggable({
        id: todo.id,
        data: {
            type: 'Todo',
            todo
        }
    });

     const style = {
        transform: CSS.Transform.toString(transform)
    };

    return (
        <TodoCard ref={setNodeRef}
                  todo={todo}
                  onClick={onClick}
                  {...attributes}
                  {...listeners} 
                  style={style}>
            {children}
        </TodoCard>
    )
}