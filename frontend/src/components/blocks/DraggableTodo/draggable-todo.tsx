import { useDraggable } from "@dnd-kit/core"
import { TodoCard } from "../Todo/todo-card"
import { type Todo } from "../../../types/types"
import { CSS } from "@dnd-kit/utilities";

type DraggableTodoProps = {
    todo: Todo,
    children: React.ReactNode
}

export default function DraggableTodoCard({todo, children}: DraggableTodoProps) {

    const { setNodeRef, attributes, listeners, transform } = useDraggable({
        id: todo.id ?? ''
    });

     const style = {
        transform: CSS.Transform.toString(transform)
    };

    return (
        <TodoCard ref={setNodeRef}
                  todo={todo}
                  {...attributes}
                  {...listeners} 
                  style={style}>
            {children}
        </TodoCard>
    )
}