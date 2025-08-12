import { queryOptions } from "@tanstack/react-query";
import { fetchUser } from "../lib/api";

export default function createUserQueryOptions() {
    return queryOptions({
        queryKey: ['user'],
        queryFn: () => fetchUser(),
    })
};