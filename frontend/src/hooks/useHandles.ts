import { addTodo, addColumn, editColumn, deleteColumn,
        deleteTodo, editTodo, logOut, postLabel, deleteLabel } from '../lib/api';
import type { Column, Todo } from '../types/types';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createTodoQueryOptions from "../queries/createTodoQueryOptions";
import createColumnQueryOptions from "../queries/createColumnQueryOptions";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function useHandles() {
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: mutateAddTodo } = useMutation({ mutationFn: ({todoData, columnId}: {todoData: Todo, columnId: string}) => addTodo(todoData, columnId),
                onSuccess: () => {
                    toast.success('Todo added sucessfully')
                    queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
                },
                onError: () => {
                    toast.error('Error adding todo')
                }
            });

    const { mutate: mutateEditTodo } = useMutation({ mutationFn: ({columnId, id, title, description}: {columnId: string, id: string, title: string, description: string}) => editTodo(columnId, id, title, description),
            onSuccess: () => {
                toast.success('Todo edited sucessfully')
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            },
            onError: () => {
                toast.error('Error editing todo')
            }
        });

    const { mutate: mutateDeleteTodo } = useMutation({ mutationFn: ({columnId, id}: {columnId: string, id: string}) => deleteTodo(columnId, id),
            onSuccess: () => {
                toast.success('Todo deleted sucessfully')
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            },
            onError: () => {
                toast.error('Error deleting todo')
            }
        });

    const { mutate: mutateAddColumn } = useMutation({ mutationFn: (columnData: Column) => addColumn(columnData),
            onSuccess: () => {
                toast.success('Column added sucessfully')
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            },
            onError: () => {
                toast.error('Error adding column')
            }
        }); 

    const { mutate: mutateEditColumn } = useMutation({ mutationFn: ({id, title}: {id: string, title: string }) => editColumn(id, title),
            onSuccess: () => {
                toast.success('Column edited sucessfully')
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            },
            onError: () => {
                toast.error('Error editing column')
            }
        });

    const { mutate: mutateDeleteColumn } = useMutation({ mutationFn: (id: string) => deleteColumn(id),
            onSuccess: () => {
                toast.success('Column deleted sucessfully')
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            },
            onError: () => {
                toast.error('Error deleting column')
            }
        });

    const { mutate: mutateAddLabel } = useMutation({ mutationFn: ({columnId, id, title}: {columnId: string, id: string, title: string}) => postLabel(columnId, id, title),
            onSuccess: () => {
                toast.success('Label added sucessfully')
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            },
            onError: () => {
                toast.error('Error adding label')
            }
        })

    const { mutate: mutateDeleteLabel } = useMutation({ mutationFn: ({columnId, id, labelId}: {columnId: string, id: string, labelId: string}) => deleteLabel(columnId, id, labelId),
            onSuccess: () => {
                toast.success('Label deleted sucessfully')
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            },
            onError: () => {
                toast.error('Error deleting label')
            }
        })

    const { mutate: mutateLogOut } = useMutation({ mutationFn: () => logOut(),
            onSuccess: () => {
                toast.success('User logged out sucessfully')
                queryClient.invalidateQueries();
            },
            onError: () => {
                toast.error('Error logging out user')
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