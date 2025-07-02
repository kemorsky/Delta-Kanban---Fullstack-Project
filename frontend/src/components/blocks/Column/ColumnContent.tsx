import { useMemo } from "react";
import { useTodos } from "../../../auth/Todo/TodoContext"
import DraggableTodoCard from "../DraggableTodo/draggable-todo";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import type { Column } from "../../../types/types";
import { TodoCardDescription, TodoCardTitle } from "../Todo/todo-card";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";

type Props = {
    columnId: string,
    column: Column,
    getTodo: (id: string) => void,
    removeTodo: (columnId: string, id: string) => void,
    children?: React.ReactNode
};

export default function ColumnContent(props: Props) {
    const { columnId, column, getTodo, removeTodo } = props
    const { todos } = useTodos();

    const columnTodos = (todos ?? []).filter((todo) => todo.columnId === columnId) // TODO: make this run once, not multiple times
    const todosId = useMemo(() => columnTodos.map((todo) => todo.id), [columnTodos]);

    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    });

    return (
        <SortableContext id={`column-${columnId}`} items={todosId} strategy={verticalListSortingStrategy}>
            <ul ref={setNodeRef} className="w-full flex flex-col gap-2 pb-4 overflow-x-hidden overflow-y-auto">
                {columnTodos.map((todo) => (
                        <DraggableTodoCard key={todo.id} todo={todo} onClick={() => getTodo(todo.id ?? '')} >
                                <TodoCardTitle>{todo.title}</TodoCardTitle>
                                <TodoCardDescription>{todo.description}</TodoCardDescription>
                            <button className="absolute bottom-2 right-2 self-end p-2 bg-red-600" 
                                    onClick={() => {removeTodo(columnId, todo.id)}}
                                    >
                                        Delete
                            </button>
                        </DraggableTodoCard>
                    ))}
            </ul>
        </SortableContext>
    )
}