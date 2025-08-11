import { addTodo, addColumn, editColumn, deleteColumn, deleteTodo, editTodo, logOut } from '../lib/api';
import type { Column, Todo } from '../types/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createTodoQueryOptions from "../queries/createTodoQueryOptions";
import createColumnQueryOptions from "../queries/createColumnQueryOptions";
import { useNavigate } from 'react-router-dom';

export default function useHandles() {
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: mutateAddTodo } = useMutation({ mutationFn: ({todoData, columnId}: {todoData: Todo, columnId: string}) => addTodo(todoData, columnId),
                onSuccess: () => {
                    queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
                },
            });

    const { mutate: mutateEditTodo } = useMutation({ mutationFn: ({columnId, id, title, description, labels}: {columnId: string, id: string, title: string, description: string, labels: string[]}) => editTodo(columnId, id, title, description, labels),
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

    const { mutate: mutateLogOut } = useMutation({ mutationFn: () => logOut(),
                    onSuccess: () => {
                        queryClient.invalidateQueries();
                    },
                });
    
    const handleLogOut = async () => {
        try {
            mutateLogOut()
            navigate('/login');
        } catch (error) {
            console.error('Error logging in:', error)
            throw new Error (`Error logging in: ${error}`);
        };
    }

    const handleAddTodo = async (columnId: string) => {
        const todoData = {
            columnId,
            title: 'New Todo',
            description: ' '
        };
        mutateAddTodo({todoData, columnId})        
    };

    const handleEditTodo = async (columnId: string, id: string, title: string, description: string, labels: string[]) => {
        mutateEditTodo({columnId, id, title, description, labels})
    };

    const handleDeleteTodo = async (columnId: string, id: string) => {
        mutateDeleteTodo({columnId, id})
    }
    
    const handleAddColumn = async () => {
        const columnData = {
            id: '',
            title: 'New Column',
        };
        mutateAddColumn(columnData)
    };

    const handleEditColumn = async (id: string, title: string ) => {
        mutateEditColumn({ id, title })
    };

    const handleDeleteColumn = async (id: string) => {
        mutateDeleteColumn(id)
    };

    return {
            handleLogOut: handleLogOut,
            handleAddTodo: handleAddTodo,
            handleEditTodo: handleEditTodo,
            handleDeleteTodo: handleDeleteTodo,
            handleAddColumn: handleAddColumn,
            handleEditColumn: handleEditColumn,
            handleDeleteColumn: handleDeleteColumn
        };               
};