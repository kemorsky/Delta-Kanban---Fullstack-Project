import { useContext, createContext } from "react";
import type { Todo, Column } from "../types/types";

type HandleContext = {
    todos: Todo[],
    columns: Column[],
    handleAddTodo: (columnId: string) => void,
    handleEditTodo: (columnId: string, id: string, title: string, description: string) => void,
    handleDeleteTodo: (columnId: string, id: string) => void,
    handleAddColumn: () => void,
    handleEditColumn: (id: string, title: string) => void,
    handleDeleteColumn: (id: string) => void
};

const HandleContext = createContext<HandleContext | null>(null);

export const useHandles = () => {
    const context = useContext(HandleContext);
    if (context === null || undefined) {
        throw new Error ('Context must be used within a Provider');
    }

    return {todos: context.todos,
            columns: context.columns,
            handleAddTodo: context.handleAddTodo,
            handleEditTodo: context.handleEditTodo,
            handleDeleteTodo: context.handleDeleteTodo,
            handleAddColumn: context.handleAddColumn,
            handleEditColumn: context.handleEditColumn,
            handleDeleteColumn: context.handleDeleteColumn};
}

export default HandleContext