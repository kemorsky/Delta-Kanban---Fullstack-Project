import { useMemo, useState } from "react"
import { useTodos } from "../../auth/Todo/TodoContext";
import { useColumns } from "../../auth/Column/ColumnContext";
import { addColumn, addTodo, deleteColumn, editColumn} from "../../lib/api";
import type { Column, Todo } from "../../types/types"
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent} from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import { ButtonAddColumn } from "../ui/button";


export default function Board() {
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [ editedTitle, setEditedTitle ] = useState<Column | null>();

    const {setTodos} = useTodos();
    const {columns, setColumns} = useColumns();

    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),);

    const handleAddColumn = async () => {
        const newColumn: Column = {
            id: '',
            title: 'New Column'
        }
        try {
            const response = await addColumn(newColumn);
            console.log(response)
            setColumns([...columns, response.column]);
        } catch (error) {
            throw new Error (`Error adding column: ${error}`);
        }
    };

    const handleDeleteColumn = async (id: string) => {
        try {
            await deleteColumn(id);
            const filtereredColumns = columns.filter((col) => col.id !== id);
            setColumns(filtereredColumns);
        } catch (error) {
            throw new Error (`Error deleting column: ${error}`);
        };
    };

    const updateColumn = async (id: string, title: string) => {
        try {
            const response = await editColumn(id, title)
            console.log(response);
            setColumns((prevColumns) => prevColumns.map((c) => 
                        c.id === id ? 
                        { ...c, title: title } : c)
                    );
        } catch (error) {
            throw new Error (`Error updating column: ${error}`);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current?.column);
            return;
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return ;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (!activeColumnId || !overColumnId) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId);
            const overColumnIndex = columns.findIndex(col => col.id === overColumnId);
            
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    };

    const createTodo = async (columnId: string) => {
        const todoData = {
            columnId,
            title: 'test2',
            description: 'test2'
        };

        try {
            const createdTodo = await addTodo(todoData, columnId); // ⬅️ will contain real id

            // Replace the todos for that column with backend-confirmed data only
            setTodos((prevTodos) => {
                if (prevTodos.some(todo => todo.id === createdTodo.todo.id)) {
                    return prevTodos;
                } else {
                    return [...prevTodos, createdTodo.todo]; // use real returned todo
                }
            });
        } catch (error) {
            throw new Error(`Error adding todo: ${error}`);
        }
    };

    return (
        <article className="w-full bg-blue-500 rounded-xl border-white overflow-x-scroll overflow-y-hidden">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="w-full h-full flex gap-2 items-start">
                    <SortableContext items={columnsId}>
                        {columns.map((column) => {
                            return (
                                <ColumnContainer key={column.id}
                                                column={column} 
                                                handleDeleteColumn={handleDeleteColumn} 
                                                updateColumn={updateColumn}
                                                createTodo={() => createTodo(column.id)}
                                                editedTitle={editedTitle}
                                                setEditedTitle={setEditedTitle}
                                />
                            )
                        })}
                    </SortableContext>
                </div>
                <ButtonAddColumn onClick={() => {handleAddColumn()}}>Add column</ButtonAddColumn>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer key={activeColumn.id}
                                            column={activeColumn}
                                            handleDeleteColumn={handleDeleteColumn}
                                            updateColumn={updateColumn}
                                            createTodo={() => createTodo(activeColumn.id)}
                                            editedTitle={editedTitle}
                                            setEditedTitle={setEditedTitle}
                            />)}
                    </DragOverlay>, 
                    document.body
                )}
            </DndContext>
        </article>

    )
}