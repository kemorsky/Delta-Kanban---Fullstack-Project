import { useState } from "react";
import type { Todo } from "../../types/types";
import { AlignLeft } from 'lucide-react';
import { InputEdit, TextAreaEditor } from "../ui/input";
import useHandles from "../../hooks/useHandles";
import { formatDate } from "../../lib/formatDate";
import { ButtonDeleteTodo, ButtonDeleteLabel, ButtonAddLabel, ButtonCloseModal, ButtonEditTodoDescription } from "../ui/button";
import { useNavigate } from "react-router-dom";
import TextEditor from "../ui/text-editor";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from "@tiptap/extension-text-style";
import Underline from '@tiptap/extension-underline'
import { formatTodoId } from "../../lib/format-todo-id";

type TodoModalProps = {
    todo?: Todo | null | undefined,
    todos: Todo[],
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>,
};

export default function TodoModal(props: TodoModalProps) {
    const [ editTodoTitle, setEditTodoTitle ] = useState<string | null>('');
    const [ editTodoDescription, setEditTodoDescription ] = useState<string | null>('');
    const [ label, setLabel ] = useState<string | null>('');

    const { todo, todos, setIsOpen } = props
    const { handleEditTodo, handleDeleteTodo } = useHandles();
    
    const navigate = useNavigate();

    const extensions = [ StarterKit, TextStyleKit, Underline ]
    
    const tiptapEditor = useEditor({
       extensions,
        content: todo?.description
    });

    if (!todo || !setIsOpen ) return;

    return (
        <div className="bg-secondary mx-auto w-full max-w-[64rem] min-h-[30rem] space-y-4 p-4 md:rounded-md absolute inset-x-0 top-[0rem] md:top-[2rem] z-50">
            <header className="flex justify-between items-center border-b">
                <article className="w-full pb-4 flex flex-col gap-2">
                    <section className="flex md:flex-row flex-col gap-2">
                        <span className="font-secondary text-3xl leading-[2.5rem] text-white/50 border border-transparent">#{formatTodoId(todos, todo.id, todo.user?.username)}</span>
                        {editTodoTitle === todo.id && (
                            <InputEdit type="text" 
                                    className="text-3xl"
                                    defaultValue={todo.title}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id ?? '', e.target.value, todo.description ?? '', todo.labels ?? []);    
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
                            <h1 className="text-3xl font-secondary leading-[2.5rem] w-full pl-2 cursor-text hover:bg-primary rounded border border-transparent hover:border-[#485fc7] shadow-sm transform transition-colors" onClick={() => setEditTodoTitle(todo.id ?? '')}>{todo.title}</h1>
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
                            {/* {label !== null && (
                                <InputEdit type="text" 
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id ?? '', todo.title ?? '', todo.description ?? '', [...todo.labels ?? [], e.target.value]);    
                                        console.log(todo.columnId, todo.id, todo.title)                                     
                                        setLabel(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus />
                            )} */}
                        </article>
                    </section>
                </article>
                <section className="self-start">
                    <ButtonCloseModal onClick={() => {navigate('/kanban'); setIsOpen(false)}} />
                </section>
            </header>
            <div className="flex md:flex-row flex-col justify-between gap-3">
                <article className="w-full md:w-2/3 min-h-[21rem] flex flex-col gap-2 bg-tertiary border border-[#111827] p-3 rounded-md">
                    <section className="flex items-end gap-2">
                        <AlignLeft />
                        <h2 className="text-xl font-secondary">Description</h2>
                    </section>
                    <div>

                        {editTodoDescription === todo.id && (
                        <>
                            <TextEditor editor={tiptapEditor} />
                            <TextAreaEditor editor={tiptapEditor} />
                            <ButtonEditTodoDescription className="w-[5rem] text-center p-2 bg-none border-green-600 hover:border-green-600 hover:bg-green-500 hover:text-white font-secondary font-semibold text-[0.875rem] text-green-200 transform transition-colors mt-2"
                                onClick={() => {
                                    const updatedDescription = tiptapEditor?.getHTML() ?? todo.description;
                                    handleEditTodo(todo.columnId, todo.id ?? '', todo.title ?? '', updatedDescription, todo.labels ?? []);
                                    setEditTodoDescription(null);
                                }}/>
                        </>
                        )}

                        {editTodoDescription !== todo.id && (
                            <article id="description" className="min-h-[7rem] font-secondary text-white/80 whitespace-pre-wrap p-2 cursor-text hover:bg-primary rounded border border-transparent hover:border-[#485fc7] shadow-sm transform transition-colors"
                                     onClick={() => setEditTodoDescription(todo.id ?? '')}
                                     dangerouslySetInnerHTML={{__html: todo.description ?? ''}}>
                                        
                            </article>
                        )}
                    </div>
                </article>
                <article className="w-full md:w-1/3 flex flex-col gap-4 bg-tertiary border border-primary p-3 rounded-md">
                    <section className="flex flex-col justify-start items-start gap-1 text-[0.875rem] font-secondary text-white/60">
                        <p>Created at: {formatDate(todo.createdAt)}</p>
                        <p>Last Edited at: {formatDate(todo.updatedAt)}</p>
                    </section>
                    <hr className="h-px border-gray-200" />
                    <section className="w-full flex flex-col items-start gap-2">
                        <ButtonDeleteTodo onClick={() => {
                            handleDeleteTodo(todo.columnId, todo.id ?? ''); 
                            setIsOpen(false);
                            navigate('/kanban');
                        }}>Delete Todo</ButtonDeleteTodo>
                    </section>
                </article>
            </div>
        </div>
    )
};