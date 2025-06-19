import { useState } from "react";
import { useTodos } from "../../../auth/Todo/TodoContext"
import type { Todo } from "../../../types/types"
import { TodoCard, TodoCardTitle, TodoCardId } from "../Todo/todo-card"
import { editTodo, deleteTodo } from "../../../lib/api";


export default function ColumnContent({columnId }: {columnId: string}) {
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
    const [editMode, setEditMode] = useState(false);
    const [mouseIsOver, setMouseIsOver] = useState(false)
    const { todos, setTodos } = useTodos()

    const columnTodos = (todos ?? []).filter((todo) => todo.columnId === columnId)

    // const editTodo =  async (todo: Todo) => { // TODO: FIX AT A LATER TIME
    //     try {
    //         const success = await editTodo(editingTodo);
    //         console.log(editingTodo);
    //         if (success) {
    //             setTodos((prevTodos) => prevTodos.map((todo) => 
    //             todo.id === editingTodo?.id ? {...todo, editingTodo} : todo
    //         ))}
    //         setEditingTodo(null);
    //         }
    //     catch (error) {
    //         throw new Error (`Error updating todo: ${error}`);
    //     }
    // };

    const removeTodo = async (id: string) => {
        try {
            await deleteTodo(columnId, id);
            setTodos((prev) => prev?.filter((todo) => todo.id !== id))
        } catch (error) {
            throw new Error (`Error deleting todo: ${error}`);
        }
    };

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false)
    }

    if (editMode) {
        return (
            <TodoCard>
                <textarea name="" id="">

                </textarea>
            </TodoCard>
        )
    }

    return (
        <article className="w-full flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto ">
            {columnTodos.map((todo) => {
                return (
                    <TodoCard key={todo.id}
                            onClick={() => {toggleEditMode(); console.log(todo.id)}}
                            onMouseEnter={() => setMouseIsOver(true)}
                            onMouseLeave={() => setMouseIsOver(false)}
                    >
                        <TodoCardId>{todo.id}</TodoCardId>
                        <TodoCardTitle>{todo.title}</TodoCardTitle>
                        {mouseIsOver && (
                            <button onClick={() => {removeTodo(todo.id!)}}>Delete</button>
                        )}
                    </TodoCard>
                )
            })}
        </article>
    )
}