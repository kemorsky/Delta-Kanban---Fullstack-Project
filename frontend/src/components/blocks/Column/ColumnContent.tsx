import { useMemo } from "react";
import type { Column, Todo } from "../../../types/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableTodoCard from "../DraggableTodo/draggable-todo";
import { TodoCardId, TodoCardTitle } from "../Todo/todo-card";
import { formatTodoId } from "../../../lib/format-todo-id";
import { Label } from "../../ui/label";

type Props = {
    todos: Todo[],
    columnId: string,
    column: Column,
    getTodo: (todo: Todo) => void,
    children?: React.ReactNode
};

export default function ColumnContent(props: Props) {
    const { getTodo, todos, columnId, column } = props;

    const columnTodos = useMemo(() => todos.filter((todo) => todo.columnId === column.id), [todos, column.id]);
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
            <ul ref={setNodeRef} className="w-full flex flex-col gap-3 px-2  pb-4 overflow-x-hidden overflow-y-auto">
                {columnTodos.map((todo) => (
                        <DraggableTodoCard key={todo.id} todo={todo} onClick={() => todo.id && getTodo(todo)} >
                                <TodoCardId>#{formatTodoId(todos, todo.id, todo.user?.username)}</TodoCardId>
                                <TodoCardTitle>{todo.title}</TodoCardTitle>
                                <section className="w-full flex flex-wrap gap-1">
                                    {todo.labels?.map((label) => (
                                        <Label key={label.labelId} className="min-w-[3rem]">
                                            <p>{label.title}</p>
                                        </Label>
                                        ))
                                    }
                                </section>
                        </DraggableTodoCard>
                    ))}
            </ul>
        </SortableContext>
    )
}