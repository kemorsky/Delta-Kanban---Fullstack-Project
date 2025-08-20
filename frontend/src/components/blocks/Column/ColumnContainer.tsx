import { useState } from "react";
import type { Column, Todo } from "../../../types/types"
import { ButtonAddTodo, ButtonDeleteColumn } from "../../ui/button";
import { ColumnWrapper } from "./ColumnWrapper";
import ColumnContent from "./ColumnContent";
import { InputEdit } from "../../ui/input";
import useHandles from "../../../hooks/useHandles";
import { LineSpinner } from "ldrs/react";
import 'ldrs/react/LineSpinner.css'

type Props = {
    className?: string,
    activeTodo?: Todo,
    overId?: string,
    todos: Todo[],
    column: Column,
    getTodo: (todo: Todo) => void,
};

export default function ColumnContainer(props: Props) {
    const { handleDeleteColumn, handleEditColumn, handleAddTodo } = useHandles();
    const { todos, column, getTodo, activeTodo, overId } = props;

    const [ editColumnId, setEditColumnId ] = useState<string | null>(null);

    if (!column) {
        return (
            <ColumnWrapper column={column}>
                <LineSpinner size="36" stroke="3" speed="1" color="white" />
            </ColumnWrapper>
        )
    }
    
    return (
        <ColumnWrapper column={column}>
            <section className="flex items-center justify-between p-2 border-b border-[#4073ffb0]">
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
                    <p tabIndex={0} className="font-secondary px-2 leading-[1.625rem] border border-transparent cursor-text"
                       onClick={() => {setEditColumnId(column.id)}}
                       onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.currentTarget.click();
                                }
                            }}>
                        {column.title}
                    </p>
                )}
                <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}} />
            </section>
            <ColumnContent todos={todos} column={column} getTodo={getTodo} activeTodo={activeTodo} overId={overId}/>
            <footer className="w-full p-2 ">
                <ButtonAddTodo  onClick={() => {handleAddTodo(column.id)}} />
            </footer>
        </ColumnWrapper>
    )
};