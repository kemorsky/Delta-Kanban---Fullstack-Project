import { useMemo, useState } from "react"
import { createPortal } from "react-dom";
import { useNavigate, Outlet } from "react-router-dom";
import type { Todo, Column } from "../../types/types"
import useHandles from "../../hooks/useHandles";
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchTodoById, reorderColumns, reorderTodos } from "../../lib/api";
import createColumnQueryOptions from "../../queries/createColumnQueryOptions";
import createTodoQueryOptions from "../../queries/createTodoQueryOptions";
import { TodoCard, TodoCardTitle } from "./Todo/todo-card";
import { ButtonAddColumn } from "../ui/button";
import ColumnContainer from "./ColumnContainer";
import TodoModal from "./todo-modal";
import Header from "./Header";

export default function Board() {
    const [ activeColumn, setActiveColumn ] = useState<Column | null>(null);
    const [ activeTodo, setActiveTodo ] = useState<Todo | null>(null);
    const [ isOpen, setIsOpen ] = useState(false);

    const { handleAddColumn } = useHandles();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const [{ data: todos, error }, { data: columns } ] = useQueries( // main fetch of data of todos and columns
            {queries: [createTodoQueryOptions(), createColumnQueryOptions()]} 
        );

    const joinedColumnIds = useMemo(() => columns?.map(col => col.id).join(','), [columns]);

    const columnsId = useMemo(() => {
        return joinedColumnIds?.split(',');
    }, [joinedColumnIds]);

    const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),);

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
            if (context?.previousColumns) {
            queryClient.setQueryData(createColumnQueryOptions().queryKey, context.previousColumns);
            }
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

    const { mutate: mutateGetTodo } = useMutation({ mutationFn: (id: string) => fetchTodoById(id), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: createTodoQueryOptions().queryKey })
        }
    });

    if (!todos || !columns || !columnsId) return <p>Loading...</p>;
    
    if (error) { console.error(error); };
    
    const getTodo = async (todo: Todo) => {
        setActiveTodo(todo);
        mutateGetTodo(todo.id ?? '');
        setIsOpen(true);
        navigate(`/kanban/todo/${todo.id}`);
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

    const handleDragEnd = async (event: DragEndEvent) => {
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

        if (activeType === 'Todo') {
            const activeTodo = active.data.current?.todo as Todo;
            const activeId = active.id;
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

            const sourceTodos = todos.filter(t => t.columnId === sourceColumnId);
            const targetTodos = todos.filter(t => t.columnId === targetColumnId);

            const updatedSourceTodos = sourceTodos.filter(t => t.id !== activeId);

            let insertIndex = targetTodos.length;

            if (overTodoId) {
                insertIndex = targetTodos.findIndex(t => t.id === overTodoId);
            }

            const filteredTargetTodos = targetTodos.filter(t => t.id !== activeId); // prep updated target todos

            const updatedTargetTodos = [
                ...filteredTargetTodos.slice(0, insertIndex),
                { ...activeTodo, columnId: targetColumnId },
                ...filteredTargetTodos.slice(insertIndex),
            ];
            
            if (sourceColumnId !== targetColumnId) { // updates source column if todo was moved across columns
                const sourceOrder = updatedSourceTodos.map(t => t.id ?? '');
                mutateReorderTodos({ orderId: sourceOrder, columnId: sourceColumnId });
            }

            const targetOrder = updatedTargetTodos.map(t => t.id ?? ''); // updates target column order
            mutateReorderTodos({ orderId: targetOrder, columnId: targetColumnId });
        };
    };

    const handleColumnOrder = async (activeId: string, overId: string) => {
        const oldIndex = columnsId.findIndex(id => id === activeId);
        const newIndex = columnsId.findIndex(id => id === overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const reordered = arrayMove(columns, oldIndex, newIndex);
        const newOrder = reordered.map(c => c.id)

        try {
            mutateReorderColumns(newOrder)
        } catch (error) {
            console.error(`Error reordering columns`, error);
        }
    };

    return (
        <main className='w-full h-full bg-primary'>
            <Header todos={todos} />
            <article className="w-full max-w-[90rem] h-full max-h-[40rem] mx-auto rounded-xl border-w flex gap-2 items-start justify-start overflow-x-auto overflow-y-hidden">
                {isOpen && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 transition transform"
                        onClick={() => {setIsOpen(false); navigate('/kanban')}
                        }
                    />
                )}
                <DndContext sensors={sensors} 
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart} 
                            onDragEnd={handleDragEnd}>
                    <SortableContext key={columnsId.join(',')} id="board" items={columnsId}>
                        {columns.map((column) => (
                                <ColumnContainer key={column.id}
                                                todos={todos}
                                                column={column}
                                                getTodo={getTodo}
                                />
                        ))}
                        <ButtonAddColumn onClick={() => {handleAddColumn()}}/>
                    </SortableContext>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer key={activeColumn.id}
                                            todos={todos}
                                            column={activeColumn}
                                            getTodo={getTodo}
                            />)}

                        {activeTodo && (
                            <TodoCard className="opacity-80 border-2 border-dashed" todo={activeTodo}>
                                <TodoCardTitle>{activeTodo.title}</TodoCardTitle>
                            </TodoCard>
                        )}
                    </DragOverlay>, 
                    document.body
                )}
                </DndContext>
                {isOpen && (
                    <>
                        <Outlet />
                        <TodoModal todo={todos.find(t => t.id === activeTodo?.id)}
                                    setIsOpen={setIsOpen}
                        />
                    </>
                    )
                }
            </article>
        </main>
    )
};
