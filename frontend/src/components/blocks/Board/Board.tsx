import { useMemo, useState } from "react"
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragOverlay, useSensor, useSensors, type DragStartEvent, type DragEndEvent, type DragOverEvent, rectIntersection, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import type { Todo, Column } from "../../../types/types"
import useHandles from "../../../hooks/useHandles";
import useBoardHandles from "../../../hooks/useBoardHandles";

import { fetchTodoById } from "../../../lib/api";
import { CustomMouseSensor } from "../../../lib/custom-mouse-sensor";
import { formatTodoId } from "../../../lib/format-todo-id";

import createColumnQueryOptions from "../../../queries/createColumnQueryOptions";
import createTodoQueryOptions from "../../../queries/createTodoQueryOptions";

import { TodoCard, TodoCardId, TodoCardTitle } from "../Todo/todo-card";
import { Label } from "../../ui/label";
import { ButtonAddColumn } from "../../ui/button";
import ColumnContainer from "../Column/ColumnContainer";
import TodoModal from "../Todo-Modal/todo-modal";
import Toast from '../../ui/toast'
import { LineSpinner } from "ldrs/react";
import 'ldrs/react/LineSpinner.css'

export default function Board() {
    const [ activeColumn, setActiveColumn ] = useState<Column | null>(null);
    const [ activeTodo, setActiveTodo ] = useState<Todo | null>(null);
    const [dragOver, setDragOver] = useState<{
        overColumnId?: string;
        overTodoId?: string;
    } | null>(null);

    const [ isOpen, setIsOpen ] = useState(false);

    const { handleAddColumn } = useHandles();
    const { handleColumnOrder, handleTodoOrder } = useBoardHandles();

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const [{ data: todos }, { data: columns }] = useQueries( // main fetch of data of todos and columns
            {queries: [createTodoQueryOptions(), createColumnQueryOptions()]}
    );

    const joinedColumnIds = useMemo(() => columns?.map(col => col.id).join(','), [columns]);
    const columnsId = useMemo(() => { return joinedColumnIds?.split(','); }, [joinedColumnIds]);

    const sensors = useSensors(
        useSensor(CustomMouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 50, tolerance: 40 } })
    );

    const { mutate: mutateGetTodo, isPending } = useMutation({
        mutationFn: (id: string) => fetchTodoById(id),
        onSuccess: (todo) => {
            setIsOpen(true);
            setActiveTodo(todo);
            navigate(`/kanban/todo/${todo.id}`);
            queryClient.invalidateQueries({ queryKey: createTodoQueryOptions().queryKey });
        }
    });

    if (!todos || !columns || !columnsId ) return (
        <article className="w-full max-w-[90rem] h-full max-h-[40rem] mx-auto rounded-xl flex p-3 md:px-8 gap-4 items-center justify-center overflow-x-auto overflow-y-hidden">
            <LineSpinner size="36" stroke="3" speed="1" color="white" />
        </article>
    );
    
    const getTodo = async (todo: Todo) => {
        mutateGetTodo(todo.id ?? '');
    };

    const handleDragStart = async (event: DragStartEvent) => {
        const { active } = event;
        const type = active.data.current?.type;

        if (type === 'Column') {
            setActiveColumn(active.data.current?.column);
        } else if (type === 'Todo') {
            setActiveTodo(active.data.current?.todo);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;
        if (active.data.current?.type !== 'Todo') return;

        const overType = over.data.current?.type;

        if (overType === 'Column') {
            const newState = { overColumnId: over.id.toString(), overTodoId: undefined };
            setDragOver(newState);
        } else if (overType === 'Todo') {
            const newState = { overColumnId: (over.data.current?.todo as Todo)?.columnId, overTodoId: over.id.toString() };
            setDragOver(newState);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        const lastDragOver = dragOver; // empty-column drop fallback

        setActiveColumn(null);
        setActiveTodo(null);
        setDragOver(null);

        if (!active) return;
        const activeType = active.data.current?.type;

        if (activeType === 'Column' && over?.id) { // Column drag
            await handleColumnReorder(active.id.toString(), over.id.toString());
            return;
        }

        if (activeType !== 'Todo') return;

        const activeTodo = active.data.current?.todo as Todo;
        const activeId = active.id;

        const previousTodos = queryClient.getQueryData<Todo[]>(createTodoQueryOptions().queryKey) ?? [];
        if (!previousTodos.find(t => t.id === activeId)) return;

        const sourceColumnId = activeTodo.columnId;
        let targetColumnId = sourceColumnId;
        let overTodoId: string | null = null;

        if (over?.data.current?.type === 'Todo') {
            const overTodo = over.data.current?.todo as Todo;
            targetColumnId = overTodo.columnId;
            overTodoId = overTodo.id ?? '';
        } else if (over?.data.current?.type === 'Column') {
            targetColumnId = over.id.toString();
        } else if (lastDragOver?.overColumnId) {
            targetColumnId = lastDragOver.overColumnId;
        } else {
            return;
        }

        // remove active todo from source column
        const updatedSourceTodos = previousTodos.filter(t => t.id !== activeId && t.columnId === sourceColumnId);

        // calculate insert index in target column
        const targetTodos = previousTodos.filter(t => t.columnId === targetColumnId);
        const insertIndex = overTodoId ? targetTodos.findIndex(t => t.id === overTodoId) : targetTodos.length;

        const todosInTargetColumn = targetTodos.filter(t => t.id !== activeId);  // build new todos array
        const beforeTarget = todosInTargetColumn.slice(0, insertIndex);
        const afterTarget = todosInTargetColumn.slice(insertIndex);

        const updatedTargetTodos = [
            ...beforeTarget,
            { ...activeTodo, columnId: targetColumnId },
            ...afterTarget
        ];
        
        const otherTodos = previousTodos.filter(t => t.columnId !== targetColumnId && t.id !== activeId); // combine with other todos
        const newTodos = [...otherTodos, ...updatedTargetTodos];

        queryClient.setQueryData(createTodoQueryOptions().queryKey, newTodos); // optimistic cache update

        if (sourceColumnId !== targetColumnId) {
            handleTodoOrder(updatedSourceTodos.map(t => t.id ?? ''), sourceColumnId );
        }
        handleTodoOrder(updatedTargetTodos.map(t => t.id ?? ''), targetColumnId);
    };

    const handleColumnReorder = async (activeId: string, overId: string) => {
        const oldIndex = columnsId.findIndex(id => id === activeId);
        const newIndex = columnsId.findIndex(id => id === overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const reordered = arrayMove(columns, oldIndex, newIndex);
        const newOrder = reordered.map(c => c.id)
        handleColumnOrder(newOrder)
    };

    return (
            <article className="w-full max-w-[90rem] h-full max-h-[40rem] mx-auto rounded-xl flex p-3 md:px-8 gap-4 items-start justify-start overflow-x-auto overflow-y-hidden">
                {isOpen && (
                    <div className="w-full h-full fixed top-0 left-0 bg-black bg-opacity-50 z-10 transition transform"
                         onClick={() => {setIsOpen(false); navigate('/kanban')}}/>
                )}
                <DndContext sensors={sensors} 
                            collisionDetection={rectIntersection}
                            onDragStart={handleDragStart} 
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}>
                    <SortableContext id="board" items={columnsId}>
                        {columns.map((column) => (
                                <ColumnContainer key={column.id}
                                                todos={todos}
                                                column={column}
                                                activeTodo={activeTodo!}
                                                getTodo={getTodo}
                                                dragOver={dragOver}
                                />
                        ))}
                    </SortableContext>
                        <ButtonAddColumn onClick={() => {handleAddColumn()}}/>
                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <ColumnContainer key={activeColumn.id}
                                                todos={todos}
                                                column={activeColumn}
                                                activeTodo={activeTodo!}
                                                getTodo={getTodo}
                                                dragOver={dragOver}                          
                                />)}
                            {activeTodo && (
                                <TodoCard className="opacity-80 border-2 border-dashed" key={activeTodo.id} todo={activeTodo}>
                                    <TodoCardId>#{formatTodoId(todos, activeTodo.id, activeTodo.user?.username)}</TodoCardId>
                                    <TodoCardTitle>{activeTodo.title}</TodoCardTitle>
                                    <section className="w-full flex flex-wrap gap-1">
                                        {activeTodo.labels?.map((label) => (
                                            <Label key={label.labelId}>
                                                <p>{label.title}</p>
                                            </Label>
                                            ))
                                        }
                                    </section>
                                </TodoCard>
                            )}
                        </DragOverlay>, 
                        document.body
                    )}
                </DndContext>
                {isOpen && (
                    <>
                        <TodoModal todos={todos}
                                    todo={todos.find(t => t.id === activeTodo?.id)}
                                    setIsOpen={setIsOpen}
                                    pending={isPending}
                        />
                    </>
                    )
                }
                <Toast />
            </article>
        )
};