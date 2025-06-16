import { type PropsWithChildren, useEffect, useState } from "react";
import type { Todo } from "../../types/types";
import TodoContext from "./TodoContext";
import { fetchTodos } from "../../lib/api";

type TodoProviderProps = PropsWithChildren;

export default function TodoProvider({ children }: TodoProviderProps) {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
      const getTodos = async () => {
        try {
          const todosData = await fetchTodos();
          setTodos(todosData);
          console.log(todosData);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };
      getTodos().catch(console.error);
    }, []);

    return (
        <TodoContext.Provider value={{todos, setTodos}}>{children}</TodoContext.Provider>
    )
}