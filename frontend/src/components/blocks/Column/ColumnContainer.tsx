import { useState } from "react";
import type { Column, Todo } from "../../../types/types"
import { ButtonAddTodo, ButtonDeleteColumn } from "../../ui/button";
import { ColumnWrapper } from "./ColumnWrapper";
import ColumnContent from "./ColumnContent";
import { InputEdit } from "../../ui/input";
import useHandles from "../../../hooks/useHandles";
import { EllipsisVertical } from 'lucide-react';
import { LineSpinner } from "ldrs/react";
import 'ldrs/react/LineSpinner.css'

type Props = {
    className?: string,
    activeTodo?: Todo,
    dragOver: { overColumnId?: string; overTodoId?: string } | null,
    todos: Todo[],
    column: Column,
    getTodo: (todo: Todo) => void,
};

export default function ColumnContainer(props: Props) {
    const { handleDeleteColumn, handleEditColumn, handleAddTodo } = useHandles();
    const { todos, column, getTodo, activeTodo, dragOver } = props;

    const [ editColumnId, setEditColumnId ] = useState<string | null>(null);
    const [ isDropped, setIsDropped ] = useState(false);

    if (!column) {
        return (
            <ColumnWrapper column={column}>
                <LineSpinner size="36" stroke="3" speed="1" color="white" />
            </ColumnWrapper>
        )
    }
    
    return (
        <ColumnWrapper column={column}>
            <section className="min-h-[3.25rem] flex items-center justify-between p-2 border-b border-border-accent">
                {editColumnId === column.id && (
                    <InputEdit
                            className="m-0 leading-[1.625rem]"
                            defaultValue={column.title}
                            onBlur={(e) => {
                                handleEditColumn(column.id, e.target.value);
                                setEditColumnId(null)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.currentTarget.blur();
                                }
                            }}
                            autoFocus 
                            />
                )}

                {editColumnId !== column.id && (
                    <p tabIndex={0} className="font-secondary px-2 leading-[1.625rem] truncate border border-transparent cursor-text"
                       onClick={() => {setEditColumnId(column.id)}}
                       onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.currentTarget.click();
                                }
                            }}>
                        {column.title}
                    </p>
                )}
                <button aria-description="column options button"
                        className="relative z-20 ml-2 border-none hover:bg-tertiary transform transition-colors"
                        onClick={() => setIsDropped((prev) => !prev)} 
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                setIsDropped(false);
                            }
                        }} 
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                setIsDropped((prev) => !prev);
                            }
                        }}>

                    <EllipsisVertical className="w-8 h-8" />
                    <ul tabIndex={-1} className={`${isDropped ? 'inline-block' : 'hidden'} absolute top-10 right-0 w-[7.5rem] bg-primary py-2 rounded`}>
                        <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}} 
                                            onKeyDown={(e) => {if (e.key === "Enter") {handleDeleteColumn(column.id)}}}
                        />
                    </ul>
                </button>        
            </section>
            <ColumnContent todos={todos} column={column} getTodo={getTodo} activeTodo={activeTodo} dragOver={dragOver}/>
            <footer className="w-full p-2">
                <ButtonAddTodo onClick={() => {handleAddTodo(column.id)}} />
            </footer>
        </ColumnWrapper>
    )
};