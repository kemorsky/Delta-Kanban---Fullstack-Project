import type { Todo } from "../types/types";

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

export const addTodo = async (todo: Todo) => {
  try {
    const response = await apiRequest(`${URL}/api/todos`, {
      method: 'POST',
      body: JSON.stringify(todo)
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error adding todo:', error);
  }
};

export const editTodo = async (id: string) => {
  try {
    const response = await apiRequest(`${URL}/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(id)
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const response = await apiRequest(`${URL}/api/todos/${id}`, {
      method: 'DELETE'
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};
