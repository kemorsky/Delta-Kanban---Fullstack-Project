import { useState } from "react";
import type { Column, Todo } from "../../../types/types"
import { ButtonAddTodo, ButtonDeleteColumn } from "../../ui/button";
import { ColumnWrapper } from "./ColumnWrapper";
import ColumnContent from "./ColumnContent";
import { InputEdit } from "../../ui/input";
import useHandles from "../../../hooks/useHandles";

type Props = {
    className?: string,
    todos: Todo[],
    column: Column,
    getTodo: (todo: Todo) => void
};

export default function ColumnContainer(props: Props) {
    const { handleDeleteColumn, handleEditColumn, handleAddTodo } = useHandles();
    const { todos, column, getTodo } = props;

    const [ editColumnId, setEditColumnId ] = useState<string | null>(null);
    
    return (
        <ColumnWrapper column={column}>
            <section className="flex items-center justify-between pb-2 border-b border-[#4073ffb0]">
                {editColumnId === column.id && (
                    <InputEdit 
                            className="m-0"
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
                    <p className="font-secondary px-2 leading-[1.625rem] cursor-text"
                       onClick={() => {setEditColumnId(column.id)}}>
                        {column.title}
                    </p>
                )}
                <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}} />
            </section>
            <ColumnContent todos={todos} columnId={column.id} column={column} getTodo={getTodo}/>
            <footer className="w-full">
                <ButtonAddTodo onClick={() => {handleAddTodo(column.id)}} />
            </footer>
        </ColumnWrapper>
    )
};