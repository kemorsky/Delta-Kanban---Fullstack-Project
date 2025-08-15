import type { Column, Label, Todo, User, UserCredentials } from "../types/types";

type RequestOptions = {
    method?: string,
    headers?: { [key: string]: string },
    body?: string,
    credentials?: RequestCredentials;
  }

const URL = 'https://backend-73ny.onrender.com'

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
          let errorMessage = 'An unknown error occurred';
          try {
            const data = await response.json();
            if (data?.message) {
              errorMessage = data.message;
            }
          } catch (error) {
            console.error(error)
          }
            throw new Error(`${errorMessage}`)
        };
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export const login = async (username: string, password: string): Promise<UserCredentials> => {
    const response = await apiRequest(`${URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return response;
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

export const fetchUser = async (): Promise<User> => { 
  try {
    const data = await apiRequest(`${URL}/api/auth/me`)
    return data;
  } catch (error) {
    throw new Error (`Error fetching user: ${error}`);
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
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({...todo, columnId})
    });
    return response;
};

export const reorderTodos = async (orderId: string[], columnId: string): Promise<Todo[]> => {
    const data = await apiRequest(`${URL}/api/todos/reorder`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({order: orderId, columnId: columnId})
    })
    return data;
};

export const editTodo = async (columnId: string, id: string, title: string, description: string): Promise<Todo> => {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({columnId, id, title, description})
    });
    return response;
};

export const deleteTodo = async (columnId: string, id: string): Promise<Todo> => {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response;
};

export const postLabel = async (columnId: string, id: string, title: string): Promise<Label> => {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}/labels/`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({title})
    })
    return response;
}

export const deleteLabel = async (columnId: string, id: string, labelId: string): Promise<Label> => {
    const response = await apiRequest(`${URL}/api/columns/${columnId}/todos/todo/${id}/labels/${labelId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    return response;
}

export const fetchColumns = async (): Promise<Column[]> => {
    const data = await apiRequest(`${URL}/api/columns`);
    return data;
};

export const addColumn = async (column: Column) => {
    const response = await apiRequest(`${URL}/api/columns`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(column)
    });
    return response;
};

export const reorderColumns = async (orderIds: string[]): Promise<{columns: Column[]}> => {
    const data = await apiRequest(`${URL}/api/columns/reorder`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({order: orderIds})
    })
    return data;
};

export const editColumn = async (id: string, title: string): Promise<Column> => {
    const response = await apiRequest(`${URL}/api/columns/column/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({id, title})
    });
    return response;
};

export const deleteColumn = async (id: string): Promise<Column> => {
    const response = await apiRequest(`${URL}/api/columns/column/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response;
};
