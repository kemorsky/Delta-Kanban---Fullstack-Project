import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { Column, Todo } from "../../types/types"
import {CSS} from '@dnd-kit/utilities';
import { ButtonAddTodo, ButtonDeleteColumn } from "../ui/button";
import { ColumnWrapper } from "./Column/ColumnWrapper";
import ColumnContent from "./Column/ColumnContent";

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

    const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
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
    return <article ref={setNodeRef} style={style}></article>
  }
    
    return (
        <ColumnWrapper ref={setNodeRef} style={style}>
            <section className="flex items-center justify-between p-2" onClick={() => {setEditMode(true)}} {...attributes} {...listeners}>
                <h3>{!editMode && column.title}</h3>
                {editMode && (
                    <input value={editedTitle?.title ?? column.title}
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
                <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}}>Delete</ButtonDeleteColumn>
            </section>
            <ColumnContent columnId={column.id} />
            <footer className="self-end">Footer
                <ButtonAddTodo onClick={() => {createTodo(column.id)}}>Add Todo</ButtonAddTodo>
            </footer>
        </ColumnWrapper>
    )
};