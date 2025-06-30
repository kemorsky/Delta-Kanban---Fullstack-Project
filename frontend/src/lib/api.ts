import type { Column, Todo } from "../types/types";

type RequestOptions = {
    method?: string,
    headers?: { [key: string]: string },
    body?: string,
  }

const URL = 'http://localhost:3000'

export const apiRequest = async (url: string, options: RequestOptions = {}) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        })
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
        };
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}


export const fetchTodos = async () => {
  try {
    const data = await apiRequest(`${URL}/api/todos`);
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

export const fetchTodoById = async (id: string) => {
  try {
    const response = await apiRequest(`${URL}/api/todos/todo/${id}`);
    return response;
  } catch (error) {
    throw new Error (`Error fetching todo: ${error}`);
  }
}

export const addTodo = async (todo: Omit<Todo, 'id'>, columnId: string) => {
  try {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos`, {
      method: 'POST',
      body: JSON.stringify({...todo, columnId})
    });
    console.log(response);  
    return response;
  } catch (error) {
    console.error('Error adding todo:', error);
  }
};

export const reorderTodos = async (orderId: string[], columnId: string) => {
  try {
    const data = await apiRequest(`${URL}/api/todos/reorder`, {
      method: 'PUT',
      body: JSON.stringify({order: orderId, columnId: columnId})
    })
    console.log(data);
    return data;
  } catch (error) {
    throw new Error (`Error reordering columns: ${error}`);
  }
};

export const editTodo = async (columnId: string, id: string, title: string, description: string) => {
  try {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}`, {
      method: 'PUT',
      body: JSON.stringify({columnId, id, title, description})
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};

export const deleteTodo = async (columnId: string, id: string) => {
  try {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}`, {
      method: 'DELETE'
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

export const fetchColumns = async () => {
  try {
    const data = await apiRequest(`${URL}/api/columns`);
    return data;
  } catch (error) {
    console.error('Error fetching columns:', error);
  }
};

export const addColumn = async (column: Column) => {
  try {
    const response = await apiRequest(`${URL}/api/columns`, {
      method: 'POST',
      body: JSON.stringify(column)
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error adding column:', error);
  }
};

export const reorderColumns = async (orderIds: string[]) => {
  try {
    const data = await apiRequest(`${URL}/api/columns/reorder`, {
      method: 'PUT',
      body: JSON.stringify({order: orderIds})
    })
    console.log(data);
    return data;
  } catch (error) {
    throw new Error (`Error reordering columns: ${error}`);
  }
};

export const editColumn = async (id: string, title: string) => {
  try {
    const response = await apiRequest(`${URL}/api/columns/column/${id}`, {
      method: 'PUT',
      body: JSON.stringify({id, title})
    });
    console.log(response);
    return response;
  } catch (error) {
    throw new Error (`Error updating column: ${error}`);
  }
};

export const deleteColumn = async (id: string) => {
  try {
    const response = await apiRequest(`${URL}/api/columns/column/${id}`, {
      method: 'DELETE'
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error deleting column:', error);
  }
};
