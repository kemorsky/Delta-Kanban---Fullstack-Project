import {useContext, createContext} from "react";
import type { Todo } from "../../types/types";

type TodoContext = {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

const TodoContext = createContext<TodoContext | null>(null);

export const useTodos = () => {
    const context = useContext(TodoContext);
    if (context === null  || undefined) {
        throw new Error ("useTodos must be used within a TodoProvider");
    }

    return {todos: context.todos, setTodos: context.setTodos}
}

export default TodoContext;