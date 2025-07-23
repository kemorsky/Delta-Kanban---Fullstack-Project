import { addTodo, addColumn, editColumn, deleteColumn, deleteTodo, editTodo } from '../lib/api';
import type { Column, Todo } from '../types/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createTodoQueryOptions from "../queries/createTodoQueryOptions";
import createColumnQueryOptions from "../queries/createColumnQueryOptions";

export default function useHandles() {
    const { mutate: mutateAddTodo } = useMutation({ mutationFn: ({todoData, columnId}: {todoData: Todo, columnId: string}) => addTodo(todoData, columnId),
                onSuccess: () => {
                    queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
                },
            });

    const { mutate: mutateEditTodo } = useMutation({ mutationFn: ({columnId, id, title, description}: {columnId: string, id: string, title: string, description: string}) => editTodo(columnId, id, title, description),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            }
        });

    const { mutate: mutateDeleteTodo } = useMutation({ mutationFn: ({columnId, id}: {columnId: string, id: string}) => deleteTodo(columnId, id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            }
        });

    const { mutate: mutateAddColumn } = useMutation({ mutationFn: (columnData: Column) => addColumn(columnData),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            }
        }); 

    const { mutate: mutateEditColumn } = useMutation({ mutationFn: ({id, title}: {id: string, title: string }) => editColumn(id, title),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            }
        });

    const { mutate: mutateDeleteColumn } = useMutation({ mutationFn: (id: string) => deleteColumn(id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            }
        });

    const queryClient = useQueryClient();

    // PLACE getTodo HERE WHEN WRITTEN AND FIGURED OUT

    const handleAddTodo = async (columnId: string) => {
        const todoData = {
            columnId,
            title: 'testing drag',
            description: 'draggy drag'
        };
        mutateAddTodo({todoData, columnId})        
    };

    const handleEditTodo = async (columnId: string, id: string, title: string, description: string) => {
        console.log('handleEditTodo called with:', columnId, id, title, description);
        mutateEditTodo({columnId, id, title, description})
    };

    const handleDeleteTodo = async (columnId: string, id: string) => {
        mutateDeleteTodo({columnId, id})
        console.log('todo deleted');
    }
    
    const handleAddColumn = async () => {
        const columnData = {
            id: '',
            title: 'New Column Query Test',
        };
        mutateAddColumn(columnData)
        console.log('column added');
    };

    const handleEditColumn = async (id: string, title: string ) => {
        mutateEditColumn({ id, title })
    };

    const handleDeleteColumn = async (id: string) => {
        mutateDeleteColumn(id)
    };

    return {
            handleAddTodo: handleAddTodo,
            handleEditTodo: handleEditTodo,
            handleDeleteTodo: handleDeleteTodo,
            handleAddColumn: handleAddColumn,
            handleEditColumn: handleEditColumn,
            handleDeleteColumn: handleDeleteColumn
        };               
};
