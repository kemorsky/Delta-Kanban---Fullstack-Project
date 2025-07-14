import { useMemo } from "react";
import type { Column, Todo } from "../../../types/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableTodoCard from "../DraggableTodo/draggable-todo";
import { TodoCardDescription, TodoCardTitle } from "../Todo/todo-card";
import useHandles from "../../../hooks/useHandles";

type Props = {
    todos: Todo[],
    columnId: string,
    column: Column,
    getTodo: (todo: Todo) => void,
    children?: React.ReactNode
};

export default function ColumnContent(props: Props) {
    const { getTodo, todos, columnId, column } = props;
    const { handleDeleteTodo } = useHandles();

    const columnTodos = todos.filter((todo) => todo.columnId === column.id) // TODO: make this run once, not multiple times
    const todosId = useMemo(() => columnTodos.map((todo) => todo.id ?? ''), [columnTodos]);

    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    });

    return (
        <SortableContext id={`column-${columnId}`} items={todosId} strategy={verticalListSortingStrategy}>
            <ul ref={setNodeRef} className="w-full flex flex-col gap-3 pb-4 overflow-x-hidden overflow-y-auto">
                {columnTodos.map((todo) => (
                        <DraggableTodoCard key={todo.id} todo={todo} onClick={() => {getTodo(todo)}} >
                                <TodoCardTitle>{todo.title}</TodoCardTitle>
                                <TodoCardDescription>{todo.description}</TodoCardDescription>
                            <button className="absolute bottom-2 right-2 self-end p-2 bg-red-600" 
                                    onClick={() => {handleDeleteTodo(columnId, todo.id ?? '')}}
                                    >
                                        Delete
                            </button>
                        </DraggableTodoCard>
                    ))}
            </ul>
        </SortableContext>
    )
}