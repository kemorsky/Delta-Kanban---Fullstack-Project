import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { Column, Id, Todo } from "../../types/types"
import {CSS} from '@dnd-kit/utilities';
import { ButtonAddTodo, ButtonDeleteColumn } from "../ui/button";
import ColumnWrapper from "./Column/ColumnWrapper";
import ColumnContent from "./Column/ColumnContent";
import { useTodos } from "../../auth/Todo/TodoContext";
import { editTodo } from "../../lib/api";

type Props = {
    column: Column,
    handleDeleteColumn: (id: Id) => void,
    updateColumn: (id: Id, title: string) => void,
    createTodo: (columnId: Id) => void
}

export default function ColumnContainer(props: Props) {
    const { column, handleDeleteColumn, updateColumn, createTodo } = props;

    const {setTodos} = useTodos();

    const [editingTitle, setEditingTitle] = useState<Todo | null>(null)
    const [editMode, setEditMode] = useState(false);

    const editTitle =  async (title: string) => {
        try {
            const success = await editTodo(editingTitle);
            console.log(editingTitle);
            if (success) {
                setTodos((prevTodos) => prevTodos.map((todo) => 
                todo.id === editingTitle?.id ? {...todo, editingTitle} : todo
            ))}
            setEditingTitle(null);
            }
            catch (error) {
                throw new Error (`Error updating todo: ${error}`);
            }
        };

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
    return <article ref={setNodeRef} style={style}></article>
  }
    
    return (
        <ColumnWrapper ref={setNodeRef} style={style}>
            <section className="flex items-center justify-between" onClick={() => {setEditMode(true)}} {...attributes} {...listeners}>
                <h3>{!editMode && column.title}</h3>
                {editMode && (
                    <input value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            autoFocus 
                            onBlur={() => {setEditMode(false)}}/>)}
                <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}}>Delete</ButtonDeleteColumn>
            </section>
            <ColumnContent columnId={column.id} />
            <footer className="self-end">Footer
                <ButtonAddTodo onClick={() => {createTodo(column.id)}}>Add Todo</ButtonAddTodo>
            </footer>
        </ColumnWrapper>
    )
};