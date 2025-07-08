import { useState } from "react";
import type { Todo } from "../../types/types";
import { InputEdit } from "../ui/input";

type TodoModalProps = {
    open: boolean,
    setIsOpen: (open: boolean) => void,
    getTodo: (id: string) => void,
    todo: Todo | null,
    handleEditTodo: (columnId: string, id: string, title: string, description: string) => void,
    handleDeleteTodo: (columnId: string, id: string) => void,
};

export default function TodoModal(props: TodoModalProps) {

    const { open, setIsOpen, todo, handleEditTodo, handleDeleteTodo } = props
    const [ editTodoId, setEditTodoId ] = useState<string | null>(null);
    
    if (!todo) return;

    return (
        <dialog open={open} setIsOpen={setIsOpen} className="bg-green-700 mx-auto w-[60rem] h-[30rem] space-y-4 p-6 rounded-2xl border border-gray-300 absolute inset-x-0 top-1/2 -translate-y-1/2">
            <header className="flex justify-between items-center border-b">
                <article className="pb-4 flex flex-col gap-2">
                    <p>Date</p>
                    <button className="absolute bottom-2 right-2 self-end p-2 bg-red-600" onClick={() => {handleDeleteTodo(todo.columnId, todo.id ?? '')}}>Delete</button>

                    <section className="flex gap-2">
                        <span className="text-3xl">#1</span>
                        

                        {editTodoId === todo.id && (
                            <InputEdit type="text" 
                                    defaultValue={todo.title}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id!, e.target.value, todo.description!)                                         
                                        setEditTodoId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                        {editTodoId !== todo.id && (
                            <h1 className="text-3xl" onClick={() => setEditTodoId(todo.id ?? '')}>{todo.title}</h1>
                        )}
                    </section>
                    <section className="flex gap-1.5">
                        <span className="flex items-center gap-1 bg-blue-300 rounded px-2 py-1 text-sm border border-black">
                            <p>label 1</p>
                            <button className="flex items-center justify-center w-6 h-6">x</button>
                        </span>
                        <span className="flex items-center gap-1 bg-blue-300 rounded px-2 py-1 text-sm border border-black">
                            <p>label 2</p>
                            <button className="flex items-center justify-center w-6 h-6">x</button>
                        </span>
                        <button>+ Add Label</button>
                    </section>
                </article>
                <section className="self-start">
                    <button>X</button>
                </section>
            </header>
            <div className="flex justify-between gap-3">
                <article className="w-2/3 flex flex-col gap-4 bg-green-600 px-2 py-4 rounded-md">
                    <section className="flex items-center gap-2">
                        <p>X</p>
                        <h2 className="text-xl">Description</h2>
                    </section>
                    <p className="text-base">Description</p>
                    {editTodoId === todo.id && (
                            <InputEdit type="text" 
                                    defaultValue={todo.description}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id!, todo.title!, e.target.value)                                         
                                        console.log(todo.columnId, todo.id)
                                        setEditTodoId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                    {editTodoId !== todo.id && (
                        <p onClick={() => setEditTodoId(todo.id ?? '')}>{todo.description}</p>
                    )}
        
                </article>
                <article className="w-1/3 flex flex-col gap-4 bg-green-800 px-2 py-4 rounded-md">
                    <section className="w-full flex flex-col items-start gap-2">
                        <h2 className="text-xl">Reserved for buttons</h2>
                        <button className="w-full flex items-start px-3 py-1.5">Delete Todo</button>
                        <button className="w-full flex items-start px-3 py-1.5">Delete Todo</button>
                    </section>
                </article>
            </div>
        </dialog>
    )
};