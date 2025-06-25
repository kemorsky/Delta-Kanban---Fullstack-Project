import { useMemo, useState } from "react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Column, Todo } from "../../types/types"
import { CSS } from '@dnd-kit/utilities';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent} from '@dnd-kit/core';
import { arrayMove } from "@dnd-kit/sortable";
import { ButtonAddTodo, ButtonDeleteColumn } from "../ui/button";
import { ColumnWrapper } from "./Column/ColumnWrapper";
import ColumnContent from "./Column/ColumnContent";
import { InputEdit } from "../ui/input";
import { Plus } from "lucide-react";
import { useTodos } from "../../auth/Todo/TodoContext";
import { reorderTodos } from "../../lib/api";
import { createPortal } from "react-dom";

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
    const {todos, setTodos} = useTodos();

    const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
    const [editMode, setEditMode] = useState(false);

    const todosId = useMemo(() => todos.map((todo) => todo.id), [todos]);

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: column.id,
        data: {
            type: "Column",
            columnId: column.id
        }},
        // disabled: editMode, // FIX LATER
    );
  
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),);

    const handleDragStart = async (event: DragStartEvent) => {
            if (event.active.data.current?.type === 'Todo') {
                setActiveTodo((event?.active.data.current?.todo as {todo: Todo}).todo);
                return;
            }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;

        // if (!over) return;

        // const activeTodo = active.data.current?.todo as Todo;
        // const targetColumn = over.data.current?.columnId as string;

        // if (targetColumn === activeTodo.columnId) {
        //     return; 
        // };

        // const updatedTodo = {...activeTodo, columnId: targetColumn};

        // setTodos((prev) => prev.map(todo => todo.id === updatedTodo.id ? updatedTodo: todo));

        const oldIndex = todosId.findIndex((id => id === active.id))
        let newIndex;

        if (!over) {
            newIndex = todos.length -1;
        } else if (active.id === over.id) {
            return;
        } else {
            newIndex = todosId.findIndex((id => id === over.id));
        };

        if (newIndex === -1) {
            return;
        }

        const reordered = arrayMove(todos, oldIndex, newIndex);
        const newOrder = reordered.map(t => t.id)

        console.log("Reorder todo IDs:", newOrder);

        try {
            // const response = await reorderTodos([updatedTodo.id], targetColumn);
            const response = await reorderTodos(newOrder, column.id);
            console.log(response.todos)
            setTodos(prevTodos => {
                const reorderedTodos = prevTodos.filter(t => t.columnId !== column.id);
                return [...reorderedTodos, ...response.todos]
            });
        } catch (error) {
            throw new Error (`Error reordering todos: ${error}`);
        }
        
    }

    if (isDragging) {
        return <article className="w-full max-w-[22rem] h-full min-h-[28rem] rounded-xl opacity-80 border-2 border-dashed" 
                        ref={setNodeRef} 
                        style={style}>
                </article>
    }
    
    return (
        <ColumnWrapper ref={setNodeRef} style={style}>
            <section className="flex items-center justify-between pb-2 border-b border-[#324067]" onClick={() => {setEditMode(true)}} {...attributes} {...listeners}>
                {editMode && (
                    <InputEdit 
                            className="m-0"
                            value={editedTitle?.title ?? column.title}
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

                {!editMode && (
                    <h3>{column.title}</h3>
                )}

                <ButtonDeleteColumn onClick={() => {handleDeleteColumn(column.id)}}>Delete</ButtonDeleteColumn>
            </section>
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <SortableContext items={todosId} strategy={verticalListSortingStrategy}>
                    <ColumnContent columnId={column.id} column={column}/>
                </SortableContext>
                {createPortal(
                    <DragOverlay>
                        {activeTodo && (
                            <ColumnContent columnId={column.id} column={column} />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
            <footer className="w-full">
                <ButtonAddTodo onClick={() => {createTodo(column.id)}}><Plus className="w-[1.3125rem] h-[1.3125rem]" />Add Todo</ButtonAddTodo>
            </footer>
        </ColumnWrapper>
    )
};