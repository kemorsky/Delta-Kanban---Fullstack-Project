import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { Column } from "../../types/types"
import {CSS} from '@dnd-kit/utilities';
import { ButtonAddTodo, ButtonDeleteColumn } from "../ui/button";
import { ColumnWrapper } from "./Column/ColumnWrapper";
import ColumnContent from "./Column/ColumnContent";
import { InputEdit } from "../ui/input";
import { Plus } from "lucide-react";

type Props = {
    column: Column,
    handleDeleteColumn: (id: string) => void,
    updateColumn: (id: string, title: string) => void,
    createTodo: (columnId: string) => void
    editedTitle: Column | null | undefined,
    setEditedTitle: React.Dispatch<React.SetStateAction<Column | null | undefined>>
}

export default function ColumnContainer(props: Props) {
    const { column, handleDeleteColumn, updateColumn, createTodo, editedTitle, setEditedTitle } = props;
    const [editMode, setEditMode] = useState(false);

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        }},
        // disabled: editMode, // FIX LATER
    );
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return <article className="w-full max-w-[22rem] h-full min-h-[28rem] rounded-xl opacity-80 border-2 border-dashed" 
                    ref={setNodeRef} 
                    style={style}>
                
            </article>
  }
    
    return (
        <ColumnWrapper ref={setNodeRef} style={style}>
            <section className="flex items-center justify-between pb-2 border-b border-[#324067]" onClick={() => {setEditMode(true)}} {...attributes} {...listeners}>
                {editMode && (
                    <InputEdit 
                            className="m-0"
                            value={editedTitle?.title ?? column.title}
                            onChange={(e) => setEditedTitle({...column, title: e.target.value})   }
                            onBlur={(e) => {
                                if (e.target.value !== column.title) {
                                    updateColumn(column.id, e.target.value);
                                }
                                setEditMode(false)}}
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
            <ColumnContent columnId={column.id} />
            <footer className="w-full">
                <ButtonAddTodo onClick={() => {createTodo(column.id)}}><Plus className="w-[1.3125rem] h-[1.3125rem]" />Add Todo</ButtonAddTodo>
            </footer>
        </ColumnWrapper>
    )
};