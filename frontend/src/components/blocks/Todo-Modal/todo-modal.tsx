import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { formatDate } from "../../../lib/formatDate";
import { formatTodoId } from "../../../lib/format-todo-id";
import useHandles from "../../../hooks/useHandles";
import type { Todo } from "../../../types/types";
import { AlignLeft, Plus, Check } from 'lucide-react';
import { InputEdit, TextAreaEditor } from "../../ui/input";
import { ButtonDeleteTodo, ButtonDeleteLabel, ButtonAddLabel, ButtonCloseModal, ButtonEditTodoDescription } from "../../ui/button";
import TextEditor from "../../ui/text-editor";
import { Label } from "../../ui/label";
import { LineSpinner } from "ldrs/react";
import 'ldrs/react/LineSpinner.css'

type TodoModalProps = {
    todo?: Todo | null | undefined,
    todos?: Todo[],
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>,
    pending?: boolean;
};

export default function TodoModal(props: TodoModalProps) {
    const [ editTodoTitle, setEditTodoTitle ] = useState<string | null>('');
    const [ editTodoDescription, setEditTodoDescription ] = useState<string | null>('');
    const [ editTodoLabel, setEditTodoLabel ] = useState<string | null>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const { todo, todos, setIsOpen, pending } = props
    const { handleEditTodo, handleDeleteTodo, handleAddLabel, handleDeleteLabel } = useHandles();
    
    const navigate = useNavigate();

    const extensions = [ StarterKit ]
    
    const tiptapEditor = useEditor({
       extensions,
        content: todo?.description
    });

    if (!setIsOpen ) return;

    if (pending || !todo) {
        return (
        <div className="bg-secondary mx-auto w-full max-w-[64rem] h-[30rem] p-4 md:rounded-md absolute inset-x-0 top-[0rem] md:top-[2rem] z-50">
            <section className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <LineSpinner size="36" stroke="3" speed="1" color="white" />
            </section>
        </div>)
    }

    return (
        <div tabIndex={0} onKeyDown={(e) => {if (e.key === 'Escape') {navigate('/kanban'); {setIsOpen(false)}}}} 
             className="bg-secondary mx-auto w-full max-w-[64rem] min-h-[30rem] p-4 md:rounded-md absolute inset-x-0 top-[0rem] md:top-[2rem] z-50">
            <input className="absolute opacity-0 w-0 h-0 p-0 cursor-none"
                autoFocus
                aria-hidden="true"
            />
            <header className="flex justify-between items-center border-b">
                <article className="w-full pb-4 flex flex-col gap-2">
                    <section className="flex md:flex-row flex-col gap-2">
                            {todo.done && (
                                <span className="w-16 min-h-[1.3125rem] h-[2.625rem] flex items-center justify-center font-secondary rounded bg-green-700">Done</span>
                            )}  
                        <span className="font-secondary text-3xl leading-[2.5rem] text-white/50 border border-transparent">#{formatTodoId(todos ?? [], todo.id, todo.user?.username)}</span>
                        {editTodoTitle === todo.id && (
                            <InputEdit type="text" 
                                    className="text-3xl leading-[2.5rem]"
                                    defaultValue={todo.title}
                                    onBlur={(e) => {
                                        handleEditTodo(todo.columnId, todo.id ?? '', e.target.value, todo.description ?? '', todo.done ?? false);    
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
                            <h1 tabIndex={0} className="text-3xl font-secondary leading-[2.5rem] w-full max-w-[56.37rem] md:px-2 cursor-text hover:bg-primary rounded border border-transparent hover:border-[#485fc7] shadow-sm transform transition-colors" 
                                onClick={() => setEditTodoTitle(todo.id ?? '')}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.currentTarget.click();
                                    }
                                }}>
                                    {todo.title}
                            </h1>
                        )}
                    </section>
                    <section className="flex flex-col items-start gap-1.5 font-secondary text-white/75">
                        <span className="flex items-center justify-center gap-1.5 text-[1.125rem] text-white/65">
                            <label htmlFor="label">Labels:</label>
                            <p className={`${todo.labels?.length === 5 ? 'text-red-400' : ''} w-[1.875rem]`}>{todo.labels?.length}
                                <span className="text-white">/5</span>
                            </p>
                            {editTodoLabel !== todo.id && ( 
                                <ButtonAddLabel disabled={todo.labels?.length === 5} className="flex sm:hidden" onClick={() => {setEditTodoLabel(todo.id ?? '')}}><Plus className="w-4 h-4" /> Add Label</ButtonAddLabel> 
                            )}
                            {editTodoLabel === todo.id && (
                                <>
                                    <ButtonAddLabel className="flex sm:hidden"
                                                    onClick={() => {
                                                        const value = inputRef.current?.value.trim()
                                                        if (value) {
                                                            handleAddLabel(todo.columnId, todo.id ?? '', value)
                                                        }
                                                        setEditTodoLabel(null)}}>Save Label
                                    </ButtonAddLabel>
                                    <button className="sm:hidden text-sm px-2 py-1 rounded" onClick={() => {setEditTodoLabel(null)}}>Cancel</button>
                                </>
                            )}     
                        </span>
                        
                        <article className="min-h-[1.875rem] flex flex-wrap gap-1.5">
                            {todo.labels?.map((label) => (
                                    <Label key={label.labelId}>
                                        <p>{label.title}</p>
                                        <ButtonDeleteLabel onClick={() => {handleDeleteLabel(todo.columnId, todo.id ?? '', label.labelId ?? '')}} />
                                    </Label>
                                ))
                            }

                            {editTodoLabel === todo.id && (
                                <>
                                    <input type="text"
                                            className="w-[6rem] flex items-center gap-1 bg-blue-600 rounded px-2 py-1 text-sm border border-black focus:outline-none"
                                            ref={inputRef}
                                            placeholder=''
                                            autoFocus/>
                                    <ButtonAddLabel onClick={() => {
                                                        const value = inputRef.current?.value.trim()
                                                        if (value) {
                                                            handleAddLabel(todo.columnId, todo.id ?? '', value)
                                                        }
                                                        setEditTodoLabel(null)}}>Save Label
                                    </ButtonAddLabel>
                                    <button className="hidden sm:flex text-sm px-2 py-1 rounded" onClick={() => {setEditTodoLabel(null)}}>Cancel</button>
                                </>
                            )}

                            {editTodoLabel !== todo.id && ( 
                                <ButtonAddLabel disabled={todo.labels?.length === 5} onClick={() => {setEditTodoLabel(todo.id ?? '')}}>
                                    <Plus className="w-4 h-4" /> 
                                    Add Label
                                    </ButtonAddLabel> 
                            )}
                        </article>
                    </section>
                </article>
                <section className="self-start">
                    <ButtonCloseModal onClick={() => {navigate('/kanban'); setIsOpen(false)}}
                                      onKeyDown={(e) => {
                                            if (e.key === "Escape") {
                                                {navigate('/kanban'); setIsOpen(false)}
                                            }
                                        }}/>
                </section>
            </header>
            <div className="flex md:flex-row flex-col justify-between gap-3 mt-4">
                <article className="w-full md:w-2/3 min-h-[21rem] flex flex-col gap-2 bg-tertiary border border-[#111827] p-3 rounded-md">
                    <section className="flex items-end gap-2">
                        <AlignLeft />
                        <h2 className="text-xl font-secondary">Description</h2>
                    </section>
                    <section>
                        {editTodoDescription === todo.id && (
                        <>
                            <TextEditor editor={tiptapEditor} />
                            <TextAreaEditor editor={tiptapEditor}/>
                            <ButtonEditTodoDescription className="w-[5rem] text-center p-2 bg-none border-green-600 hover:border-green-600 hover:bg-green-500 hover:text-white font-secondary font-semibold text-[0.875rem] text-green-200 transform transition-colors mt-2"
                                onClick={() => {
                                    const updatedDescription = tiptapEditor?.getHTML() ?? todo.description;
                                    handleEditTodo(todo.columnId, todo.id ?? '', todo.title ?? '', updatedDescription, todo.done ?? false);
                                    setEditTodoDescription(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.currentTarget.click();
                                    }
                                }}/>
                            <button className="w-[5rem] text-center p-2 ml-2 bg-none hover:text-white hover:border-white/75 font-secondary font-semibold text-[0.875rem] text-white/75 transform transition-colors mt-2" 
                            onClick={() => {setEditTodoDescription(null)}}>Cancel</button >
                        </>
                        )}

                        {editTodoDescription !== todo.id && (
                            <section>
                                <article tabIndex={0} id="description" className="min-h-[7rem] font-secondary text-white/80 whitespace-pre-wrap p-2 cursor-text hover:bg-primary rounded border border-transparent hover:border-[#485fc7] transform transition-colors"
                                        onClick={() => setEditTodoDescription(todo.id ?? '')}
                                        dangerouslySetInnerHTML={{__html: todo.description ?? ''}}
                                        onKeyDown={(e) => {if (e.key === "Enter") {e.currentTarget.click()}}}>
                                </article>
                                <ButtonAddLabel className="w-[4rem] mt-4" onClick={() => setEditTodoDescription(todo.id ?? '')}>Edit</ButtonAddLabel> 
                            </section>
                            
                        )}
                    </section>
                </article>
                <article className="w-full md:w-1/3 flex flex-col gap-4 bg-tertiary border border-primary p-3 rounded-md">
                    <section className="flex flex-col justify-start items-start gap-1 text-[0.875rem] font-secondary text-white/60">
                        <p>Created at: {formatDate(todo.createdAt)}</p>
                        <p>Last Edited at: {formatDate(todo.updatedAt)}</p>
                    </section>
                    <hr className="border-gray-200" />
                    <section className="w-full flex flex-col items-start gap-2">
                        <button className="w-full flex items-center justify-center p-2 bg-none border-transparent hover:border-green-600 hover:bg-green-500 hover:text-white font-secondary font-semibold text-[0.875rem] text-green-200 transform transition-colors" onClick={() => {                     
                            handleEditTodo(todo.columnId, todo.id ?? '', todo.title ?? '', todo.description ?? '', todo.done === true ? false : true)
                        }}>
                            {todo.done ? (
                                <span>Mark as not done</span>
                            ) : (<>
                                    <Check className="w-[1.3125rem] h-[1.3125rem] mr-1"/>
                                    <span> Mark as done</span>
                                </>
                            )}
                        </button>
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