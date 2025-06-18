import { useMemo, useState } from "react"
import type { Column, Id, Todo } from "../../types/types"
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, type UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { ButtonAddColumn } from "../ui/button";
import { addTodo } from "../../lib/api";
import { useTodos } from "../../auth/Todo/TodoContext";

export default function Board() {
    const [columns, setColumns] = useState<Column[]>([])
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [newTodo, setNewTodo] = useState<Todo>()

    const {setTodos} = useTodos();

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

    const createTodo = async (columnId: Id) => {
        const newTodo: Todo = {
            columnId,
            title: 'test2',
            description: 'test2'
        };
        try {
            if (newTodo) {
                const response = await addTodo(newTodo);
                setTodos((prev) => {
                    const updated = [...prev, {...newTodo, id: response.id}]
                    return updated;
                });
                setNewTodo(newTodo);
            }
        } catch (error) {
            throw new Error(`Error adding todo: ${error}`);
        }
    }

    return (
        <article className="w-full bg-blue-500 rounded-xl border-white overflow-x-scroll overflow-y-hidden">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="w-full h-full flex gap-2 items-start">
                    <SortableContext items={columnsId}>
                        {columns.map((column) => {
                            return (
                                <ColumnContainer key={column.id.toString()}
                                                column={column} 
                                                handleDeleteColumn={handleDeleteColumn} 
                                                updateColumn={updateColumn}
                                                createTodo={() => createTodo(column.id)}
                                />
                            )
                        })}
                    </SortableContext>
                </div>
                <ButtonAddColumn onClick={() => {handleAddColumn()}}>Add column</ButtonAddColumn>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer column={activeColumn}
                                            handleDeleteColumn={handleDeleteColumn}
                                            updateColumn={updateColumn}
                                            createTodo={createTodo}
                            />)}
                    </DragOverlay>, 
                    document.body
                )}
            </DndContext>
        </article>

    )
}