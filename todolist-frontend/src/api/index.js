import axios from 'axios';

// Set default configuration for Axios
axios.defaults.withCredentials = true;

// Create axios instance
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth API endpoints
export const loginApi = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data; // Returns AuthResponseDTO (name)
};

export const registerApi = async (username, password, name) => {
  const response = await api.post('/auth/register', { username, password, name });
  return response.data; // Returns AuthResponseDTO (name)
};

// Tasks API endpoints
export const getTasksApi = async (filters = {}) => {
  const params = {};
  if (filters.completed !== undefined && filters.completed !== null) {
    params.completed = filters.completed;
  }
  if (filters.dueDate) {
    params.dueDate = filters.dueDate; // format: yyyy-MM-dd
  }
  if (filters.search) {
    params.search = filters.search;
  }
  
  const response = await api.get('/Todolist', { params });
  return response.data; // Returns ApiResponse<List<TaskResponseDTO>>
};

export const createTaskApi = async (taskData) => {
  const response = await api.post('/Todolist', taskData);
  return response.data; // Returns ApiResponse<TaskResponseDTO>
};

export const updateTaskApi = async (id, taskData) => {
  const response = await api.put(`/Todolist/${id}`, taskData);
  return response.data; // Returns ApiResponse<TaskResponseDTO>
};

export const deleteTaskApi = async (id) => {
  const response = await api.delete(`/Todolist/${id}`);
  return response.data; // Returns ApiResponse<Void>
};

export default api;
