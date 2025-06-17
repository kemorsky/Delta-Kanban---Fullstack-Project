import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { Column, Id } from "../../types/types"
import {CSS} from '@dnd-kit/utilities';

type Props = {
    column: Column,
    handleDeleteColumn: (id: Id) => void,
    updateColumn: (id: Id, title: string) => void,
}

export default function ColumnContainer(props: Props) {
    const { column, handleDeleteColumn, updateColumn } = props;

    const [editMode, setEditMode] = useState(false);

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: column.id as unknown as string,
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
    return <article ref={setNodeRef} style={style}>ugabuga</article>
  }
    
    return (
        <article ref={setNodeRef} style={style}>
            <section onClick={() => {setEditMode(true)}} {...attributes} {...listeners}>
                {!editMode && column.title}
                {editMode && (
                    <input value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            autoFocus 
                            onBlur={() => {setEditMode(false)}}/>)}
                <button onClick={() => {handleDeleteColumn(column.id)}}>Delete</button>
            </section>
            <section>
                Content
            </section>
            <footer>Footer</footer>
        </article>
    )
};