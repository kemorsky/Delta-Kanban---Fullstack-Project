import { useState } from "react";
import type { Todo } from "../../types/types";
import { AlignLeft } from 'lucide-react';
import { InputEdit, TextAreaEdit } from "../ui/input";
import useHandles from "../../hooks/useHandles";
import { formatDate } from "../../lib/formatDate";
import { ButtonDeleteTodo, ButtonDeleteLabel } from "../ui/button";

type TodoModalProps = {
    todo: Todo | null | undefined,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
};

export default function TodoModal(props: TodoModalProps) {

    const [ editTodoTitle, setEditTodoTitle ] = useState<string | null>(null);
    const [ editTodoDescription, setEditTodoDescription ] = useState<string | null>(null);
    const { todo, setIsOpen } = props
    const { handleEditTodo, handleDeleteTodo } = useHandles();
    
    if (!todo) return;

    return (
        <div className="bg-[#1F2937] mx-auto w-[60rem] h-[30rem] space-y-4 p-6 rounded-2xl border border-gray-300 absolute inset-x-0 top-1/2 -translate-y-1/2">
            <header className="flex justify-between items-center border-b">
                <article className="w-full pb-4 flex flex-col gap-2">
                    <section className="flex gap-2">
                        <span className="text-3xl">#{todo.id}</span>
                        
                        {editTodoTitle === todo.id && (
                            <InputEdit type="text" 
                                    className="text-3xl m-0"
                                    defaultValue={todo.title}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id ?? '', e.target.value, todo.description ?? '')    
                                        console.log(todo.columnId, todo.id, todo.title)                                     
                                        setEditTodoTitle(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                        {editTodoTitle !== todo.id && (
                            <h1 className="text-3xl font-secondary" onClick={() => setEditTodoTitle(todo.id ?? '')}>{todo.title}</h1>
                        )}
                    </section>
                    <section className="flex gap-1.5">
                        {todo.labels?.map((label) => (
                            <span key={label} className="min-w-[5rem] flex items-center gap-1 bg-blue-300 rounded px-2 py-1 text-sm border border-black">
                                <p>{label}</p>
                                <ButtonDeleteLabel />
                            </span>
                        ))}
                        <button>+ Add Label</button>
                    </section>
                </article>
                <section className="self-start">
                    <button onClick={() => {setIsOpen(false)}} >X</button>
                </section>
            </header>
            <div className="flex justify-between gap-3">
                <article className="w-2/3 flex flex-col gap-2 bg-[#314157] px-2 py-4 rounded-md">
                    <section className="flex items-end gap-2">
                        <AlignLeft />
                        <h2 className="text-xl font-secondary">Description</h2>
                    </section>
                    {editTodoDescription === todo.id && (
                            <TextAreaEdit
                                    defaultValue={todo.description}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id ?? '', todo.title ?? '', e.target.value)                                         
                                        console.log(e.target.value)
                                        setEditTodoDescription(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                        )}

                    {editTodoDescription !== todo.id && (
                        <p className="font-secondary text-white/80" onClick={() => setEditTodoDescription(todo.id ?? '')}>{todo.description}</p>
                    )}
        
                </article>
                <article className="w-1/3 flex flex-col gap-4 bg-[#314157] px-2 py-4 rounded-md">
                    <section className="flex flex-col justify-start items-start gap-1 text-[0.875rem]">
                        <p>Created at: {formatDate(todo.createdAt)}</p>
                        <p>Last Edited at: {formatDate(todo.updatedAt)}</p>
                    </section>
                    <section className="w-full flex flex-col items-start gap-2">
                        <h2 className="text-xl">Reserved for buttons</h2>
                        <ButtonDeleteTodo onClick={() => {handleDeleteTodo(todo.columnId, todo.id ?? '')}}>Delete Todo</ButtonDeleteTodo>
                    </section>
                </article>
            </div>
        </div>
    )
};