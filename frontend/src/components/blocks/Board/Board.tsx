import { useMemo, useState } from "react"
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragOverlay, useSensor, useSensors, type DragStartEvent, type DragEndEvent, type DragOverEvent, rectIntersection } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import type { Todo, Column } from "../../../types/types"
import useHandles from "../../../hooks/useHandles";

import { fetchTodoById, reorderColumns, reorderTodos } from "../../../lib/api";
import { CustomMouseSensor } from "../../../lib/custom-mouse-sensor";
import { formatTodoId } from "../../../lib/format-todo-id";
import { showToastError } from "../../../lib/toast-utils";

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
    // const [ overId, setOverId ] = useState<string>();
    const [ isOpen, setIsOpen ] = useState(false);

    const { handleAddColumn } = useHandles();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const [{ data: todos, error }, { data: columns  }] = useQueries( // main fetch of data of todos and columns
            {queries: [createTodoQueryOptions(), createColumnQueryOptions()]}
    );

    const joinedColumnIds = useMemo(() => columns?.map(col => col.id).join(','), [columns]);
    const columnsId = useMemo(() => { return joinedColumnIds?.split(','); }, [joinedColumnIds]);

    const sensors = useSensors(useSensor(CustomMouseSensor, { activationConstraint: { distance: 10 } }),);

    const { mutate: mutateReorderColumns } = useMutation({
        mutationFn: reorderColumns,
        onMutate: async (newOrderIds: string[]) => {
            await queryClient.cancelQueries({ queryKey: createColumnQueryOptions().queryKey });

            const previousColumns = queryClient.getQueryData<Column[]>(createColumnQueryOptions().queryKey);

            const updated = previousColumns?.slice().sort((a, b) => {
                return newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id);
            });

            queryClient.setQueryData(
                createColumnQueryOptions().queryKey,
                updated
            );

            return { previousColumns };
        },
        onError: (_, __, context) => {
            showToastError('Error reordering columns');
            if (context?.previousColumns) {
                queryClient.setQueryData(createColumnQueryOptions().queryKey, context.previousColumns);
            };
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: createColumnQueryOptions().queryKey });
        }
    });

    const { mutate: mutateReorderTodos } = useMutation({ mutationFn: ({orderId, columnId} : {orderId: string[], columnId: string}) => reorderTodos(orderId, columnId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: createTodoQueryOptions().queryKey });
        }
    });

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
    if (error) { console.error(error); };
    
    const getTodo = async (todo: Todo) => {
        mutateGetTodo(todo.id ?? '');
        console.log(todo)
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

    const handleDragOver = async (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.data.current?.type !== 'Todo' || over.data.current?.type !== 'Column') return;
        const overType = over.data.current?.type;

        if (overType === 'Column') {
            active.data.current.hoveredColumnId = over.id;
            console.log(over.id)
        } else if (overType === 'Todo') {
            const overTodo = over.data.current?.todo as Todo;
            active.data.current.hoveredTodoId = overTodo.id;
            console.log(overTodo.id)
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveColumn(null);
        setActiveTodo(null);

        if (!over || over.id === active.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === 'Column') {
            await handleColumnOrder(active.id.toString(), over.id.toString());
            return;
        }

        if (activeType === 'Todo') {
            const activeTodo = active.data.current?.todo as Todo;
            const activeId = active.id;

            // grab current todos from cache
            const previousTodos = queryClient.getQueryData<Todo[]>(createTodoQueryOptions().queryKey) ?? [];

            // skip optimistic reorder if the todo no longer exists (deleted)
            if (!previousTodos.find(t => t.id === activeId)) return;

            const sourceColumnId = activeTodo.columnId;

            let targetColumnId = sourceColumnId;
            let overTodoId: string | null = null;

            if (overType === 'Todo') {
                const overTodo = over.data.current?.todo as Todo;
                targetColumnId = overTodo.columnId;
                overTodoId = overTodo.id ?? '';
            } else if (overType === 'Column') {
                targetColumnId = over.id.toString();
            }

            // remove active todo from source column
            const updatedSourceTodos = previousTodos.filter(t => t.id !== activeId && t.columnId === sourceColumnId);

            // calculate insert index in target column
            const targetTodos = previousTodos.filter(t => t.columnId === targetColumnId);
            const insertIndex = overTodoId ? targetTodos.findIndex(t => t.id === overTodoId) : targetTodos.length;

            // build new todos array
            const todosInTargetColumn = targetTodos.filter(t => t.id !== activeId);
            const beforeTarget = todosInTargetColumn.slice(0, insertIndex);
            const afterTarget = todosInTargetColumn.slice(insertIndex);

            const updatedTargetTodos = [
                ...beforeTarget,
                { ...activeTodo, columnId: targetColumnId },
                ...afterTarget
            ];

            const otherTodos = previousTodos.filter(t => t.columnId !== targetColumnId && t.id !== activeId);

            const newTodos = [...otherTodos, ...updatedTargetTodos];

            // optimistic cache update
            queryClient.setQueryData(createTodoQueryOptions().queryKey, newTodos);

            // final API calls
            if (sourceColumnId !== targetColumnId) {
                const sourceOrder = updatedSourceTodos.map(t => t.id ?? '');
                mutateReorderTodos({ orderId: sourceOrder, columnId: sourceColumnId });
            }
            const targetOrder = updatedTargetTodos.map(t => t.id ?? '');
            mutateReorderTodos({ orderId: targetOrder, columnId: targetColumnId });
        }
    };

    const handleColumnOrder = async (activeId: string, overId: string) => {
        const oldIndex = columnsId.findIndex(id => id === activeId);
        const newIndex = columnsId.findIndex(id => id === overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const reordered = arrayMove(columns, oldIndex, newIndex);
        const newOrder = reordered.map(c => c.id)
        mutateReorderColumns(newOrder)
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
                                                // overId={?????} // cause of no cross-column ui feedback
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