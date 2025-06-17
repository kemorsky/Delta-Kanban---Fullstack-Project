import { useMemo, useState } from "react"
import type { Column, Id } from "../../types/types"
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, type UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export default function Board() {
    const [columns, setColumns] = useState<Column[]>([])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),);

    const generateId = () => {
        return Math.floor(Math.random() * 10001);
    }

    const handleAddColumn = () => {
        const newColumn: Column = {
            id: generateId() as unknown as Id,
            title: `New Column`
        }
        setColumns([...columns, newColumn]);
    };

    const handleDeleteColumn = (id: Id) => {
        const filtereredColumns = columns.filter((col) => col.id !== id);
        setColumns(filtereredColumns);
    };

    const updateColumn = (id: Id, title: string) => {
        const newColumns = columns.map((column) => {
            if (column.id !== id) return column;
            return {...column, title};
        });

        setColumns(newColumns);
    }

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
            const activeColumnIndex = columns.findIndex(col => col.id as unknown as UniqueIdentifier === activeColumnId);
            const overColumnIndex = columns.findIndex(col => col.id as unknown as UniqueIdentifier  === overColumnId);
            
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <article>
                <div>
                    <SortableContext items={columnsId}>
                        {columns.map((column) => {
                            return (
                                <ColumnContainer key={column.id.toString()}
                                                column={column} 
                                                handleDeleteColumn={handleDeleteColumn} 
                                                updateColumn={updateColumn}
                                />
                            )
                        })}
                    </SortableContext>
                </div>
                <button onClick={() => {handleAddColumn()}}>Add column
            </button>
            </article>
            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ColumnContainer column={activeColumn}
                                        handleDeleteColumn={handleDeleteColumn}
                                        updateColumn={updateColumn}
                        />)}
                </DragOverlay>, 
                document.body
            )}
        </DndContext>
    )
}