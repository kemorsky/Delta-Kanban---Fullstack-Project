import { queryOptions } from "@tanstack/react-query";
import { fetchColumns } from "../lib/api";

export default function createColumnQueryOptions() {
    return queryOptions({
        queryKey: ['columns'],
        queryFn:() => fetchColumns()
    })
};