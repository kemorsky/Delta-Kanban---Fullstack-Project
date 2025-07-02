import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { Column, Todo } from "../../types/types"
import { CSS } from '@dnd-kit/utilities';
// import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { ButtonAddTodo, ButtonDeleteColumn } from "../ui/button";
import { ColumnWrapper } from "./Column/ColumnWrapper";
import ColumnContent from "./Column/ColumnContent";
import { InputEdit } from "../ui/input";
import { Plus } from "lucide-react";


type Props = {
    className?: string,
    column: Column,
    todos: Todo[],
    handleEditColumn: (id: string, title: string) => void,
    handleDeleteColumn: (id: string) => void,
    createTodo: (columnId: string) => void,
    getTodo: (id: string) => void,
    removeTodo: (columnId: string, id: string) => void
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>
};

export default function ColumnContainer(props: Props) {
    const { column, handleDeleteColumn, handleEditColumn, createTodo, setColumns, getTodo, removeTodo } = props;

    const [editMode, setEditMode] = useState(false);

    // const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    //     id: column.id,
    //     data: {
    //         type: "Column",
    //         columnId: column.id
    //     }},
    //     // disabled: editMode, // FIX LATER
    // );
  
    // const style = {
    //     transform: CSS.Transform.toString(transform),
    //     opacity: isDragging ? 0.5 : 1,
    //     border: isDragging ? "2px dashed #ffffff" : "",
    //     height: isDragging ? "min-h-[139px] max-h-[515px]" : "",
    //     transition,
    // };
    
    return (
        <ColumnWrapper column={column}>
            <section className="flex items-center justify-between pb-2 border-b border-[#324067]" onClick={() => {setEditMode(true)}}>
                {editMode && (
                    <InputEdit 
                            className="m-0"
                            value={column.title}
                            onChange={(e) => setColumns((prev) => prev.map((c) => c.id === column.id ? {...c, title: e.target.value} : c))   }
                            onBlur={(e) => {
                                handleEditColumn(column.id, e.target.value);
                                setEditMode(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.currentTarget.blur();
                                }
                            }}
                            autoFocus 
                            />
                )}

                {!editMode && (
                    <h3>{column.title}</h3>
                )}

                <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}}>Delete</ButtonDeleteColumn>
            </section>
            <ColumnContent columnId={column.id} column={column} getTodo={getTodo} removeTodo={removeTodo}/>
            <footer className="w-full">
                <ButtonAddTodo onClick={() => {createTodo(column.id)}}><Plus className="w-[1.3125rem] h-[1.3125rem]" />Add Todo</ButtonAddTodo>
            </footer>
        </ColumnWrapper>
    )
};