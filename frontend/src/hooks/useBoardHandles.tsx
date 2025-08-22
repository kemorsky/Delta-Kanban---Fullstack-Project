import type { Column } from '../types/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createTodoQueryOptions from "../queries/createTodoQueryOptions";
import createColumnQueryOptions from "../queries/createColumnQueryOptions";
import { showToastError } from '../lib/toast-utils';
import { reorderColumns, reorderTodos } from '../lib/api';

export default function useBoardHandles() {
    const queryClient = useQueryClient();

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

        const handleColumnOrder = async (newOrderIds: string[]) => {
                mutateReorderColumns(newOrderIds)
        };

        const handleTodoOrder = async (orderId: string[], columnId: string) => {
                mutateReorderTodos({ orderId, columnId })
        };

    return {handleColumnOrder: handleColumnOrder,
            handleTodoOrder: handleTodoOrder}
}