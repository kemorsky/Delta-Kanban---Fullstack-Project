import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import createTodoQueryOptions from "../../queries/createTodoQueryOptions";
import createColumnQueryOptions from "../../queries/createColumnQueryOptions";
import { addColumn, addTodo, editTodo, deleteTodo, editColumn } from "../../lib/api";
import type { Column, Todo } from "../../types/types";
import { useState } from "react";

export default function QueryTest() {
    const [ editColumnId, setEditColumnId ] = useState<string | null>(null);
    const [ editTodoId, setEditTodoId ] = useState<string | null>(null);
  
    const [{ data: todos, error }, { data: columns } ] = useQueries({queries: [createTodoQueryOptions(), createColumnQueryOptions()]});

    const { mutate: mutateAddTodo } = useMutation({ mutationFn: ({todoData, columnId}: {todoData: Todo, columnId: string}) => addTodo(todoData, columnId),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            }
        });

    const { mutate: mutateEditTodo } = useMutation({ mutationFn: ({columndId, id, title, description}: {columndId: string, id: string, title: string, description: string}) => editTodo(columndId, id, title, description),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            }
        });

    const { mutate: mutateDeleteTodo } = useMutation({ mutationFn: ({columnId, id}: {columnId: string, id: string}) => deleteTodo(columnId, id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createTodoQueryOptions().queryKey})
            }
        });

    const { mutate: mutateColumn } = useMutation({ mutationFn: (columnData: Column) => addColumn(columnData),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            }
        }); 

    const { mutate: mutateEditColumn } = useMutation({ mutationFn: ({id, title}: {id: string, title: string }) => editColumn(id, title),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: createColumnQueryOptions().queryKey})
            }
        });

    const queryClient = useQueryClient();

    if (!todos || !columns) return <p>Loading...</p>;
    
    if (error) {
        console.error(error);
    };

    const handleAddTodo = async (columnId: string) => {
        const todoData = {
            columnId,
            title: 'testing drag',
            description: 'draggy drag'
        };
        mutateAddTodo({todoData, columnId})
        console.log('todo added');
        
    };

    const handleEditTodo = async (columndId: string, id: string, title: string, description: string) => {
        mutateEditTodo({columndId, id, title, description})
    };

    const handleEditColumn = async (id: string, title: string ) => {
        mutateEditColumn({ id, title })
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
        mutateColumn(columnData)
        console.log('column added');
    };
    
    return (
        <div>
            <h1>Query Test</h1>
            <button onClick={() => {handleAddColumn()}}>Add Column</button>
            {columns.map((column) => 
                <article key={column.id} className="bg-blue-600 p-4 w-[20rem] h-[20rem] rounded-xl flex flex-col gap-3">
                    {editColumnId === column.id && (
                        <input type="text"
                                defaultValue={column.title}
                                onBlur={(e) => {handleEditColumn(column.id, e.target.value);
                                                setEditColumnId(null)}
                                        }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.currentTarget.blur();
                                }
                            }}
                            autoFocus  />
                    )}
                    {editColumnId !== column.id && (
                        <p onClick={() => {setEditColumnId(column.id)}}>{column.title}</p>
                    )}
                    <div key={column.id}>
                        {todos.filter((todo) => todo.columnId === column.id).map((todo) => {
                            return (
                                <article key={todo.id}>
                                    {editTodoId === todo.id && (
                                        <input type="text"
                                                defaultValue={todo.title}
                                                onBlur={(e) => {handleEditTodo(todo.columnId, todo.id ?? '', e.target.value, todo.description ?? '')
                                                                setEditTodoId(null)
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.currentTarget.blur();
                                                    }
                                                }}
                                                autoFocus />
                                    )}
                                    {editTodoId !== todo.id && (
                                        <p onClick={() => {setEditTodoId(todo.id ?? '')}}>{todo.title}</p>
                                    )}
                                </article>
                            )
                        })}
                    </div>
                    <button onClick={() => {handleAddTodo(column.id)}}>Add Todo</button>
                </article>
            )}
        </div>
    )
};
