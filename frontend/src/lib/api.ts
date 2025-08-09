import type { Column, Todo, UserCredentials } from "../types/types";

type RequestOptions = {
    method?: string,
    headers?: { [key: string]: string },
    body?: string,
    credentials?: RequestCredentials;
  }

const URL = 'http://localhost:3000'

export const apiRequest = async (url: string, options: RequestOptions = {}) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
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

export const login = async (username: string, password: string): Promise<UserCredentials> => {
  try {
    const response = await apiRequest(`${URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return response;
  } catch (error) {
    throw new Error (`Error logging in: ${error}`);
  }
}

export const logOut = async (): Promise<void> => {
  try {
    const response = await apiRequest(`${URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response;
  } catch (error) {
    throw new Error (`Error logging in: ${error}`);
  }
}

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const data = await apiRequest(`${URL}/api/todos`);
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
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

export const addTodo = async (todo: Todo, columnId: string): Promise<Todo> => {
  try {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({...todo, columnId})
    });
    return response;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const reorderTodos = async (orderId: string[], columnId: string): Promise<Todo[]> => {
  try {
    const data = await apiRequest(`${URL}/api/todos/reorder`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({order: orderId, columnId: columnId})
    })
    return data;
  } catch (error) {
    throw new Error (`Error reordering columns: ${error}`);
  }
};

export const editTodo = async (columnId: string, id: string, title: string, description: string): Promise<Todo> => {
  try {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({columnId, id, title, description})
    });
    return response;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw new Error (`Error updating todo: ${error}`);
  }
};

export const deleteTodo = async (columnId: string, id: string): Promise<Todo> => {
  try {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const fetchColumns = async (): Promise<Column[]> => {
  try {
    const data = await apiRequest(`${URL}/api/columns`);
    return data;
  } catch (error) {
    console.error('Error fetching columns:', error);
    throw error;
  }
};

export const addColumn = async (column: Column) => {
  try {
    const response = await apiRequest(`${URL}/api/columns`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(column)
    });
    return response;
  } catch (error) {
    console.error('Error adding column:', error);
  }
};

export const reorderColumns = async (orderIds: string[]): Promise<{columns: Column[]}> => {
  try {
    const data = await apiRequest(`${URL}/api/columns/reorder`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({order: orderIds})
    })
    return data;
  } catch (error) {
    throw new Error (`Error reordering columns: ${error}`);
  }
};

export const editColumn = async (id: string, title: string): Promise<Column> => {
  try {
    const response = await apiRequest(`${URL}/api/columns/column/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({id, title})
    });
    return response;
  } catch (error) {
    throw new Error (`Error updating column: ${error}`);
  }
};

export const deleteColumn = async (id: string): Promise<Column> => {
  try {
    const response = await apiRequest(`${URL}/api/columns/column/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response;
  } catch (error) {
    throw new Error (`Error deleting column: ${error}`);
  }
};
