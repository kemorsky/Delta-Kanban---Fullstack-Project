import { addTodo, addColumn, editColumn, deleteColumn,
        deleteTodo, editTodo, logOut, postLabel, deleteLabel } from '../lib/api';
import type { Column, Todo } from '../types/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createTodoQueryOptions from "../queries/createTodoQueryOptions";
import createColumnQueryOptions from "../queries/createColumnQueryOptions";
import { useNavigate } from 'react-router-dom';
import { showToastSuccess, showToastError } from '../lib/toast-utils';

export default function useHandles() {
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: mutateAddTodo } = useMutation({ mutationFn: ({todoData, columnId}: {todoData: Todo, columnId: string}) => addTodo(todoData, columnId),
                onSuccess: () => {
                    showToastSuccess('Todo added successfully')
                    queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
                },
                onError: (error: Error) => {
                    showToastError(error.message);
                }
            });

    const { mutate: mutateEditTodo } = useMutation({ mutationFn: ({columnId, id, title, description}: {columnId: string, id: string, title: string, description: string}) => editTodo(columnId, id, title, description),
                onSuccess: () => {
                    showToastSuccess('Todo edited successfully')
                    queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
                },
                onError: (error: Error) => {
                    showToastError(error.message);
                }
            });

    const { mutate: mutateDeleteTodo } = useMutation({ mutationFn: ({columnId, id}: {columnId: string, id: string}) => deleteTodo(columnId, id),
            onSuccess: () => {
                showToastSuccess('Todo deleted successfully')
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            },
            onError: (error: Error) => {
                    showToastError(error.message);
                }
        });

    const { mutate: mutateAddColumn } = useMutation({ mutationFn: (columnData: Column) => addColumn(columnData),
            onSuccess: () => {
                showToastSuccess('Column added successfully')
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            },
            onError: (error: Error) => {
                    showToastError(error.message);
                }
        }); 

    const { mutate: mutateEditColumn } = useMutation({ mutationFn: ({id, title}: {id: string, title: string }) => editColumn(id, title),
            onSuccess: () => {
                showToastSuccess('Column edited successfully')
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            },
            onError: (error: Error) => {
                    showToastError(error.message);
                }
        });

    const { mutate: mutateDeleteColumn } = useMutation({ mutationFn: (id: string) => deleteColumn(id),
            onSuccess: () => {
                showToastSuccess('Column deleted successfully')
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            },
            onError: (error: Error) => {
                    showToastError(error.message);
                }
        });

    const { mutate: mutateAddLabel } = useMutation({ mutationFn: ({columnId, id, title}: {columnId: string, id: string, title: string}) => postLabel(columnId, id, title),
            onSuccess: () => {
                showToastSuccess('Label added successfully')
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            },
            onError: (error: Error) => {
                    showToastError(error.message);
                }
        })

    const { mutate: mutateDeleteLabel } = useMutation({ mutationFn: ({columnId, id, labelId}: {columnId: string, id: string, labelId: string}) => deleteLabel(columnId, id, labelId),
            onSuccess: () => {
                showToastSuccess('Label deleted successfully')
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            },
            onError: (error: Error) => {
                    showToastError(error.message);
                }
        })

    const { mutate: mutateLogOut } = useMutation({ mutationFn: () => logOut(),
            onSuccess: () => {
                showToastSuccess('User logged out successfully')
                queryClient.invalidateQueries();
            },
            onError: (error: Error) => {
                    showToastError(error.message);
                }
        });
    
    const handleLogOut = async () => {
        try {
            mutateLogOut()
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error)
            throw new Error (`Error logging out: ${error}`);
        };
    }

    const handleAddTodo = async (columnId: string) => {
        const todoData = {
            columnId,
            title: 'New Todo',
            description: ' '
        };
        mutateAddTodo({ todoData, columnId })        
    };

    const handleEditTodo = async (columnId: string, id: string, title: string, description: string) => {
        mutateEditTodo({ columnId, id, title, description })
    };

    const handleDeleteTodo = async (columnId: string, id: string) => {
        mutateDeleteTodo({ columnId, id })
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

    const handleAddLabel = async (columnId: string, id: string, title: string) => {
        mutateAddLabel({columnId, id, title})        
    };

    const handleDeleteLabel = async (columnId: string, id: string, labelId: string) => {
        mutateDeleteLabel({ columnId, id, labelId })
    }

    return {
            handleLogOut: handleLogOut,
            handleAddTodo: handleAddTodo,
            handleEditTodo: handleEditTodo,
            handleDeleteTodo: handleDeleteTodo,
            handleAddColumn: handleAddColumn,
            handleEditColumn: handleEditColumn,
            handleDeleteColumn: handleDeleteColumn,
            handleAddLabel: handleAddLabel,
            handleDeleteLabel: handleDeleteLabel
        };               
};