import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const loginApi = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const registerApi = async (username, password, name) => {
  const response = await api.post('/auth/register', { username, password, name });
  return response.data;
};

export const getTasksApi = async (filters = {}) => {
  const params = {};
  if (filters.completed !== undefined && filters.completed !== null) {
    params.completed = filters.completed;
  }
  if (filters.dueDate) {
    params.dueDate = filters.dueDate;
  }
  if (filters.search) {
    params.search = filters.search;
  }
  if (filters.priority) {
    params.priority = filters.priority;
  }

  const response = await api.get('/Todolist', { params });
  return response.data;
};

export const createTaskApi = async (taskData) => {
  const response = await api.post('/Todolist', taskData);
  return response.data;
};

export const updateTaskApi = async (id, taskData) => {
  const response = await api.put(`/Todolist/${id}`, taskData);
  return response.data;
};

export const deleteTaskApi = async (id) => {
  const response = await api.delete(`/Todolist/${id}`);
  return response.data;
};

export default api;
