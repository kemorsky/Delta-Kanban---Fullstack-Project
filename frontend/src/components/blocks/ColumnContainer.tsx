import { useState } from "react";
import type { Column, Todo } from "../../types/types"
// import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ButtonAddTodo, ButtonDeleteColumn } from "../ui/button";
import { ColumnWrapper } from "./Column/ColumnWrapper";
import ColumnContent from "./Column/ColumnContent";
import { InputEdit } from "../ui/input";
import { Plus } from "lucide-react";
import useHandles from "../../hooks/useHandles";

type Props = {
    className?: string,
    todos: Todo[],
    column: Column,
};

export default function ColumnContainer(props: Props) {
    const { getTodo, handleDeleteColumn, handleEditColumn, handleAddTodo } = useHandles();
    const { todos, column } = props;

    const [ editColumnId, setEditColumnId ] = useState<string | null>(null);
    
    return (
        <ColumnWrapper column={column}>
            <section className="flex items-center justify-between pb-2 border-b border-[#324067]">
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
                    <p onClick={() => {setEditColumnId(column.id)}}>{column.title}</p>
                )}
                <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}}>Delete</ButtonDeleteColumn>
            </section>
            <ColumnContent todos={todos} columnId={column.id} column={column} getTodo={getTodo}/>
            <footer className="w-full">
                <ButtonAddTodo onClick={() => {handleAddTodo(column.id)}}><Plus className="w-[1.3125rem] h-[1.3125rem]" />Add Todo</ButtonAddTodo>
            </footer>
        </ColumnWrapper>
    )
};