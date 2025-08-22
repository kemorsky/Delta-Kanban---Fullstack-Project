import { useMemo } from "react";
import type { Column, Todo } from "../../../types/types";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableTodoCard from "../DraggableTodo/draggable-todo";
import { TodoCardId, TodoCardDoneTag, TodoCardTitle, } from "../Todo/todo-card";
import { formatTodoId } from "../../../lib/format-todo-id";
import { Label } from "../../ui/label";

type Props = {
    todos: Todo[],
    activeTodo?: Todo,
    dragOver: { overColumnId?: string; overTodoId?: string } | null,
    column: Column,
    getTodo: (todo: Todo) => void,
    children?: React.ReactNode
};

export default function ColumnContent(props: Props) {
    const { getTodo, todos, column, activeTodo, dragOver } = props;

  const columnTodos = useMemo(() => {
    const todosInColumn = todos.filter((todo) => todo.columnId === column.id);

    if (!activeTodo || !dragOver) return todosInColumn;

    const { overColumnId, overTodoId } = dragOver;

    const isOverColumn = overColumnId === column.id
    const isOverTodo = overTodoId && todosInColumn.some((t) => t.id === overTodoId)

    if ((isOverColumn && isOverTodo || isOverColumn) && !todosInColumn.find(t => t.id === activeTodo.id)) {
      return [...todosInColumn, { ...activeTodo, columnId: column.id }];
    }

    return todosInColumn;
  }, [todos, column.id, activeTodo, dragOver]);

    const todosId = useMemo(() => columnTodos.map((todo) => todo.id ?? ''), [columnTodos]);

    const { setNodeRef } = useDroppable({
        id: column.id,
        data: { type: 'Column', column }
    });

    return (
        <ul ref={setNodeRef} className="w-full h-full flex flex-col gap-3 px-2 pt-1 pb-4 overflow-x-hidden overflow-y-auto">
            <SortableContext items={todosId} strategy={verticalListSortingStrategy}>
                {columnTodos.map((todo) => (
                    <DraggableTodoCard key={todo.id} todo={todo} onClick={() => todo.id && getTodo(todo)} onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            (e.currentTarget as HTMLElement).click();
                                        }
                                    }}>
                            <article className="w-full flex items-center justify-between">
                                <TodoCardId>#{formatTodoId(todos, todo.id, todo.user?.username)}</TodoCardId>
                                {todo.done && (
                                    <TodoCardDoneTag>Done</TodoCardDoneTag>
                                )}
                            </article>
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
            </SortableContext>
        </ul>
    )
}