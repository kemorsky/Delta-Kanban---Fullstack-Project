import { useMemo, useState } from "react"
import { useTodos } from "../../auth/Todo/TodoContext";
import { useColumns } from "../../auth/Column/ColumnContext";
import { reorderColumns, reorderTodos } from "../../lib/api";
import type { Column, Todo } from "../../types/types"
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, type DragOverEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import { ButtonAddColumn } from "../ui/button";
import { Plus } from "lucide-react";
import TodoModal from "./todo-modal";
import { TodoCard, TodoCardDescription, TodoCardTitle } from "./Todo/todo-card";

type BoardProps = {
    createTodo: (columnId: string) => void,
    getTodo: (id: string) => void,
    todoData: Todo | null,
    updateTodo: (columnId: string, id: string, title: string, description: string) => void,
    removeTodo: (columnId: string, id: string) => void,
    handleAddColumn: () => void,
    handleEditColumn: (id: string, title: string) => void,
    handleDeleteColumn: (id: string) => void
}

export default function Board(props: BoardProps) {
    const { createTodo, getTodo, todoData, updateTodo, removeTodo, handleAddColumn, handleEditColumn, handleDeleteColumn } = props;
    const [ activeColumn, setActiveColumn ] = useState<Column | null>(null);
    const [ activeTodo, setActiveTodo ] = useState<Todo | null>(null);
    const [ editTitle, setEditTitle ] = useState<string | null>(null);
    const [ editDescription, setEditDescription ] = useState<string | null>(null);
    
    const { todos, setTodos } = useTodos();
    const { columns, setColumns } = useColumns();

    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);

    const groupedTodos = useMemo(() => {
        const map = new Map();
        columns.forEach((c) => map.set(c.id, []));
        todos.forEach((t) => map.get(t.columnId)?.push(t));
        return map;
    }, [columns, todos]);

    const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),);

    const handleDragStart = async (event: DragStartEvent) => {
        const { active } = event;
        const type = active.data.current?.type;

        if (type === 'Column') {
            setActiveColumn(active.data.current?.column);
        } else if (type === 'Todo') {
            setActiveTodo(active.data.current?.todo);
        }
    };

    const handleDragOver = (event: DragOverEvent) => { //TODO: FIX INFINITE LOOP IN HERE WITH setTodos
        const { active, over } = event;
        if (!over) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType !== 'Todo') return;

        const activeTodo = active.data.current?.todo as Todo;
        const activeId = active.id;

        if (overType === 'Todo') {
            const overTodo = over.data.current?.todo as Todo;
            if (activeId === overTodo.id) return;

            setTodos((todos) => {
                const updatedTodos = [...todos];
                const activeIndex = updatedTodos.findIndex(t => t.id === activeId);
                const overIndex = updatedTodos.findIndex(t => t.id === overTodo.id);

                if (activeIndex === -1 || overIndex === -1) return todos;

                const activeItem = updatedTodos[activeIndex];
                updatedTodos.splice(activeIndex, 1);
                updatedTodos.splice(overIndex, 0, { ...activeItem, columnId: overTodo.columnId });

                return updatedTodos;
            });
        } else if (overType === 'Column') {
            const overColumnId = over.id.toString();

            if (activeTodo.columnId === overColumnId) return;

            setTodos((todos) => {
                const updatedTodos = [...todos];
                const activeIndex = updatedTodos.findIndex(t => t.id === activeId);
                if (activeIndex === -1) return todos;

                updatedTodos[activeIndex] = { ...updatedTodos[activeIndex], columnId: overColumnId };
                return updatedTodos;
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => { // TODO: FIX MISALIGNMENT BETWEEN DRAGOVER AND DRAGEND
        setActiveColumn(null);
        setActiveTodo(null);
        const { active, over } = event;
        if (!over) return;
  
        if (over.id === active.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === 'Column') {
            await handleColumnOrder(active.id.toString(), over.id.toString())
            setActiveColumn(null);
            return;
        };

        if (activeType !== 'Todo') return;
        
        const activeTodo = active.data.current?.todo as Todo;
        const sourceColumnId = activeTodo.columnId;

        let targetColumnId = sourceColumnId;
        let overTodoId: string | null = null;

        if (overType === 'Todo') {
            const overTodo = over.data.current?.todo as Todo;
            targetColumnId = overTodo.columnId;
            overTodoId = overTodo.id;
        } else if (overType === 'Column') {
            targetColumnId = over.id.toString();
        }

        const updatedTodos = [...todos];
        const sourceIndex = updatedTodos.findIndex(t => t.id === activeTodo.id);
        if (sourceIndex === -1) return;
        updatedTodos.splice(sourceIndex, 1);

        const targetTodos = updatedTodos.filter(t => t.columnId === targetColumnId);
        let newIndex = targetTodos.length;

        if (overTodoId) {
            const overIndex = targetTodos.findIndex(t => t.id === overTodoId);
            if (overIndex !== -1) newIndex = overIndex
        }

        const newTodo = {...activeTodo, columnId: targetColumnId}
        const targetInsertIndex = updatedTodos.findIndex((t) => {
            if (newIndex === 0) return t.columnId === targetColumnId;
            return t.id === targetTodos[newIndex]?.id;
        })

        if (targetInsertIndex === -1) {
            updatedTodos.push(newTodo);
        } else {
            updatedTodos.splice(targetInsertIndex, 0, newTodo);
        }

        setTodos(updatedTodos);

        const newOrder = updatedTodos
            .filter(t => t.columnId === targetColumnId)
            .map(t => t.id);

        try {
            await reorderTodos(newOrder, targetColumnId);
        } catch (error) {
            console.error(`Error reordering todos`, error);
        }
    };

    const handleColumnOrder = async (activeId: string, overId: string) => {
        const oldIndex = columnsId.findIndex(id => id === activeId);
        const newIndex = columnsId.findIndex(id => id === overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const reordered = arrayMove(columns, oldIndex, newIndex);
        const newOrder = reordered.map(c => c.id)

        try {
            const response = await reorderColumns(newOrder);
            setColumns(response.columns);
        } catch (error) {
            console.error(`Error reordering columns`, error);
        }
    };

    return (
        <article className="w-full h-full max-h-[40rem] bg-blue-500 rounded-xl border-w flex gap-2 items-start justify-start overflow-x-auto overflow-y-hidden">
            <DndContext sensors={sensors} 
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart} 
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        >
                <SortableContext id="board" items={columnsId}>
                    {columns.map((column) => (
                            <ColumnContainer key={column.id}
                                            column={column}
                                            getTodo={getTodo}
                                            removeTodo={removeTodo}
                                            setColumns={setColumns}
                                            todos={groupedTodos.get(column.id) ?? []}
                                            handleDeleteColumn={handleDeleteColumn} 
                                            handleEditColumn={handleEditColumn}
                                            createTodo={() => createTodo(column.id)}
                            />
                    ))}
                    <ButtonAddColumn onClick={() => {handleAddColumn()}}><Plus className="w-[1.3125rem] h-[1.3125rem]" />Add column</ButtonAddColumn>
                </SortableContext>
            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ColumnContainer // key={activeColumn.id}
                                        column={activeColumn}
                                        getTodo={getTodo}
                                        removeTodo={removeTodo}
                                        setColumns={setColumns}
                                        todos={groupedTodos.get(activeColumn.id) ?? []}
                                        handleDeleteColumn={handleDeleteColumn}
                                        handleEditColumn={handleEditColumn}
                                        createTodo={() => createTodo(activeColumn.id)}
                        />)}

                    {activeTodo && (
                        <TodoCard className="opacity-80 border-2 border-dashed" todo={activeTodo}>
                            <TodoCardTitle>{activeTodo.title}</TodoCardTitle>
                            <TodoCardDescription>{activeTodo.description}</TodoCardDescription>
                        </TodoCard>
                    )}
                </DragOverlay>, 
                document.body
            )}
            </DndContext>
            <TodoModal getTodo={getTodo}
                    todoData={todoData}
                    updateTodo={updateTodo} 
                    removeTodo={removeTodo} 
                    editTitle={editTitle} 
                    setEditTitle={setEditTitle} 
                    editDescription={editDescription} 
                    setEditDescription={setEditDescription} />
        </article>
    )
};
