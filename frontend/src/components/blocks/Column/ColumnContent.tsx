import { useState } from "react";
import { useTodos } from "../../../auth/Todo/TodoContext"
import { TodoCardTitle, TodoCardDescription } from "../Todo/todo-card"
import DraggableTodoCard from "../DraggableTodo/draggable-todo";
import { editTodo, deleteTodo } from "../../../lib/api";
import { InputEdit } from "../../ui/input";
import { useDroppable } from "@dnd-kit/core";
import type { Column } from "../../../types/types";

type Props = {
    columnId: string,
    column: Column
};

export default function ColumnContent(props: Props) {
    const { columnId, column } = props
    const { todos, setTodos } = useTodos()

    const [editTitle, setEditTitle] = useState<string | null>(null);
    const [editDescription, setEditDescription] = useState<string | null>(null);

    const columnTodos = (todos ?? []).filter((todo) => todo.columnId === columnId) // TODO: make this run once, not multiple times

    const { setNodeRef } = useDroppable({
        id: column.id,
    })

    const updateTodo =  async (columnId: string, id: string, title: string, description: string) => {
        try {
            const response = await editTodo(columnId, id, title, description);
            console.log(response);
            setTodos((prevTodos) => prevTodos.map((t) => 
                t.id === id ? {...t, title, description} : t
            ));
            }
        catch (error) {
            throw new Error (`Error updating todo: ${error}`);
        }
    };

    const removeTodo = async (id: string) => {
        try {
            await deleteTodo(columnId, id);
            setTodos((prev) => prev?.filter((todo) => todo.id !== id))
        } catch (error) {
            throw new Error (`Error deleting todo: ${error}`);
        }
    };

    return (
        <article ref={setNodeRef} className="w-full flex flex-col gap-2 overflow-x-hidden overflow-y-auto">
            {columnTodos.map((todo) => {
                return (
                    <DraggableTodoCard key={todo.id} todo={todo}>
                        {editTitle === todo.id && (
                            <InputEdit type="text" 
                                    value={todo.title}
                                    onChange={(e) => {
                                        setTodos((prev) => prev.map((t) => t.id === todo.id ? {...t, title: e.target.value} : t))
                                    }}
                                    onBlur={(e) => {
                                        updateTodo(todo.columnId, todo.id!, e.target.value, todo.description!)                                         
                                        console.log(todo.columnId, todo.id)
                                        setEditTitle(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                        {editTitle !== todo.id && (
                            <TodoCardTitle onClick={() => setEditTitle(todo.id ?? '')}>{todo.title}</TodoCardTitle>
                        )}

                        {editDescription === todo.id && (
                            <InputEdit type="text" 
                                    value={todo.description}
                                    onChange={(e) => {
                                        setTodos((prev) => prev.map((t) => t.id === todo.id ? {...t, description: e.target.value} : t))
                                    }}
                                    onBlur={(e) => {
                                        updateTodo(todo.columnId, todo.id!, todo.title!, e.target.value)                                         
                                        console.log(todo.columnId, todo.id)
                                        setEditDescription(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                        {editDescription !== todo.id && (
                            <TodoCardDescription onClick={() => setEditDescription(todo.id ?? '')}>{todo.description}</TodoCardDescription>
                        )}
        
                        <button className="absolute bottom-2 right-2 self-end p-2 bg-red-600" onClick={() => {removeTodo(todo.id!)}}>Delete</button>
                    </DraggableTodoCard>
                )
            })}
        </article>
    )
}