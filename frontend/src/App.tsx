import './App.css'
import { addTodo, addColumn, editColumn, deleteColumn, fetchTodoById, deleteTodo, editTodo } from './lib/api';
import type { Column, Todo } from './types/types';
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import createTodoQueryOptions from "./queries/createTodoQueryOptions";
import createColumnQueryOptions from "./queries/createColumnQueryOptions";
import Board from './components/blocks/Board';
// import TodoModal from './components/blocks/todo-modal';

export default function App() {

    const [{ data: todos, error }, { data: columns } ] = useQueries( // main fetch of data of todos and columns
        {queries: [createTodoQueryOptions(), createColumnQueryOptions()]} 
    );
    
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

    // const getTodo = async (id: string) => {
    //     try {
    //         const todoData = await fetchTodoById(id);
    //         setTodoData(todoData);
    //     } catch (error) {
    //         throw new Error (`Error fetching todo: ${error}`);
    //     }
    // };

  return (
    <main className='w-full max-w-[90rem] mx-auto h-full bg-orange-300'>
      <Board 
            todos={todos}
            columns={columns}
            handleAddTodo={handleAddTodo}
            //  getTodo={getTodo}
            handleEditTodo={handleEditTodo}
            handleDeleteTodo={handleDeleteTodo}
            handleAddColumn={handleAddColumn}
            handleEditColumn={handleEditColumn}
            handleDeleteColumn={handleDeleteColumn}
       />
    </main>
  )
}