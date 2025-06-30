import { useTodos } from "../../../auth/Todo/TodoContext"
import DraggableTodoCard from "../DraggableTodo/draggable-todo";
import { useDroppable } from "@dnd-kit/core";
import type { Column } from "../../../types/types";
import { TodoCardDescription, TodoCardTitle } from "../Todo/todo-card";

type Props = {
    columnId: string,
    column: Column,
    getTodo: (id: string) => void,
    removeTodo: (columnId: string, id: string) => void
};

export default function ColumnContent(props: Props) {
    const { columnId, column, getTodo, removeTodo } = props
    const { todos, setTodos } = useTodos();

    const columnTodos = (todos ?? []).filter((todo) => todo.columnId === columnId) // TODO: make this run once, not multiple times

    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    })

    return (
        <article ref={setNodeRef} className="w-full flex flex-col gap-2 overflow-x-hidden overflow-y-auto">
            {columnTodos.map((todo) => {
                return (
                    <DraggableTodoCard key={todo.id} todo={todo} onClick={() => getTodo(todo.id ?? '')}>
                            <TodoCardTitle>{todo.title}</TodoCardTitle>
                            <TodoCardDescription>{todo.description}</TodoCardDescription>
                        <button className="absolute bottom-2 right-2 self-end p-2 bg-red-600" onClick={() => {removeTodo(columnId, todo.id)}}>Delete</button>
                    </DraggableTodoCard>
                )
            })}
        </article>
    )
}