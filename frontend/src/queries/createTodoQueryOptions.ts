import { queryOptions } from "@tanstack/react-query";
import { fetchTodos } from "../lib/api";

export default function createTodoQueryOptions() {
    return queryOptions({
        queryKey: ['todos'],
        queryFn: () => fetchTodos()
    })
};