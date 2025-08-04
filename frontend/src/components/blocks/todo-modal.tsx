import { useState } from "react";
import type { Todo } from "../../types/types";
import { AlignLeft } from 'lucide-react';
import { InputEdit, TextAreaEdit } from "../ui/input";
import useHandles from "../../hooks/useHandles";
import { formatDate } from "../../lib/formatDate";
import { ButtonDeleteTodo, ButtonDeleteLabel, ButtonAddLabel, ButtonCloseModal } from "../ui/button";

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
        <div className="bg-[#1F2937] mx-auto w-full max-w-[64rem] min-h-[30rem] space-y-4 p-6 md:rounded-md absolute inset-x-0 top-[22.9rem] md:top-[18rem] -translate-y-1/2 z-50">
            <header className="flex justify-between items-center border-b">
                <article className="w-full pb-4 flex flex-col gap-2">
                    <section className="flex md:flex-row flex-col gap-2">
                        <span className="text-3xl leading-[2.5rem] text-white/50">{todo.id}</span>
                        {editTodoTitle === todo.id && (
                            <InputEdit type="text" 
                                    className="text-3xl m-0 p-0 w-full max-w-[27.5rem]"
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
                            <h1 className="text-3xl font-secondary leading-[2.5rem]" onClick={() => setEditTodoTitle(todo.id ?? '')}>{todo.title}</h1>
                        )}
                    </section>
                    <section className="flex flex-col items-start gap-1.5 font-secondary text-[1.125rem] text-white/75">
                        <label htmlFor="label">Labels:</label>
                        <article className="flex gap-1.5">
                            {todo.labels?.map((label) => (
                                <span key={label} className="min-w-[5rem] flex items-center gap-1 bg-blue-600 rounded px-2 py-1 text-sm border border-black">
                                    <p>{label}</p>
                                    <ButtonDeleteLabel />
                                </span>
                            ))}
                            <ButtonAddLabel>+ Add Label</ButtonAddLabel>
                        </article>
                    </section>
                </article>
                <section className="self-start">
                    <ButtonCloseModal onClick={() => {setIsOpen(false)}} />
                </section>
            </header>
            <div className="flex md:flex-row flex-col justify-between gap-3">
                <article className="w-full md:w-2/3 min-h-[21rem] flex flex-col gap-2 bg-[#314157] border border-[#111827] p-3 rounded-md">
                    <section className="flex items-end gap-2">
                        <AlignLeft />
                        <h2 className="text-xl font-secondary">Description</h2>
                    </section>
                    {editTodoDescription === todo.id && (
                        <>
                            <TextAreaEdit
                                    defaultValue={todo.description}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id ?? '', todo.title ?? '', e.target.value)                                         
                                        console.log(e.target.value)
                                        setEditTodoDescription(null);
                                    }}
                                    autoFocus />
                        </>
                    )}

                    {editTodoDescription !== todo.id && (
                        <article className="font-secondary text-white/80 whitespace-pre-wrap cursor-pointer" onClick={() => setEditTodoDescription(todo.id ?? '')}>{todo.description}</article>
                    )}
        
                </article>
                <article className="w-full md:w-1/3 flex flex-col gap-4 bg-[#314157] border border-[#111827] p-3 rounded-md">
                    <section className="flex flex-col justify-start items-start gap-1 text-[0.875rem] font-secondary text-white/60">
                        <p>Created at: {formatDate(todo.createdAt)}</p>
                        <p>Last Edited at: {formatDate(todo.updatedAt)}</p>
                    </section>
                    <hr className="h-px border-gray-200" />
                    <section className="w-full flex flex-col items-start gap-2">
                        <ButtonDeleteTodo onClick={() => {
                            handleDeleteTodo(todo.columnId, todo.id ?? ''); 
                            setIsOpen(false);
                        }}>Delete Todo</ButtonDeleteTodo>
                    </section>
                </article>
            </div>
        </div>
    )
};