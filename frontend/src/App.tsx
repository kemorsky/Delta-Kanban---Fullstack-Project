import { useState } from 'react';
import './App.css'
import { useColumns } from './auth/Column/ColumnContext';
import { useTodos } from './auth/Todo/TodoContext';
import Board from './components/blocks/Board';
// import TodoModal from './components/blocks/todo-modal';
import { addTodo, addColumn, editColumn, deleteColumn, fetchTodoById, deleteTodo, editTodo } from './lib/api';
import type { Column, Todo } from './types/types';

function App() {
    const {setTodos} = useTodos();
    const {columns, setColumns} = useColumns();
    const [ todoById, setTodoById ] = useState<Todo | null>(null);

    const createTodo = async (columnId: string) => {
        const todoData = {
            columnId,
            title: 'testing drag',
            description: 'draggy drag'
        };

        try {
            const createdTodo = await addTodo(todoData, columnId);
            // Replace the todos for that column with backend-confirmed data only
            setTodos((prevTodos) => {
                if (prevTodos.some(todo => todo.id === createdTodo.todo.id)) {
                    return prevTodos;
                } else {
                    return [...prevTodos, createdTodo.todo]; // use real returned todo
                }
            });
        } catch (error) {
            throw new Error(`Error adding todo: ${error}`);
        }
    };

    const getTodo = async (id: string) => {
        try {
            const todoData = await fetchTodoById(id);
            setTodoById(todoData);
        } catch (error) {
            throw new Error (`Error fetching todo: ${error}`);
        }
    };

    const updateTodo =  async (columnId: string, id: string, title: string, description: string) => {
        try {
            const response = await editTodo(columnId, id, title, description);
            console.log(response);
            setTodos((prevTodos) => prevTodos.map((t) => 
                t.id === id ? {...t, title, description} : t
            ));
            }
        catch (error) {
            throw new Error (`Error updating todo: ${error}`);
        }
    };

    const removeTodo = async (columnId: string, id: string) => {
        try {
            await deleteTodo(columnId, id);
            setTodos((prev) => prev?.filter((todo) => todo.id !== id))
        } catch (error) {
            throw new Error (`Error deleting todo: ${error}`);
        }
    };

    const handleAddColumn = async () => {
        const newColumn: Column = {
            id: '',
            title: 'New Column'
        }
        try {
            const response = await addColumn(newColumn);
            console.log(response)
            setColumns([...columns, response.column]);
        } catch (error) {
            throw new Error (`Error adding column: ${error}`);
        }
    };

    const handleDeleteColumn = async (id: string) => { // TODO: delete todos assigned to deleted column
        try {
            await deleteColumn(id);
            const filtereredColumns = columns.filter((col) => col.id !== id);
            setColumns(filtereredColumns);
        } catch (error) {
            throw new Error (`Error deleting column: ${error}`);
        };
    };

    const handleEditColumn = async (id: string, title: string) => {
        try {
            const response = await editColumn(id, title)
            console.log(response);
            setColumns((prevColumns) => prevColumns.map((c) => 
                        c.id === id ? 
                        { ...c, title: title } : c)
                    );
        } catch (error) {
            throw new Error (`Error updating column: ${error}`);
        }
    };

  return (
    <main className='w-full max-w-[90rem] mx-auto h-full bg-orange-300'>
      <Board createTodo={createTodo}
             getTodo={getTodo}
             todoData={todoById}
             updateTodo={updateTodo}
             removeTodo={removeTodo}
             handleAddColumn={handleAddColumn}
             handleEditColumn={handleEditColumn}
             handleDeleteColumn={handleDeleteColumn}
       />
    </main>
  )
}

export default App
