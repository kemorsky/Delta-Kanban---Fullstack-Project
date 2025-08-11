// lib/getTodoDisplayNumber.ts
import type { Todo } from "../types/types";

export const formatTodoId = (todos: Todo[], todoId?: string, username?: string): number => {
  if (!todoId || !username) return 0;

  const userTodos = todos
    .filter(t => t.user?.username === username)
    .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());

  return userTodos.findIndex(t => t.id === todoId) + 1;
};
