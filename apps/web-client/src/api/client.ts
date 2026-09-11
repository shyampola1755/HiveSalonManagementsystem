import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token and active branch header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('hive_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeBranchId = localStorage.getItem('hive_active_branch');
  if (activeBranchId) {
    config.headers['x-branch-id'] = activeBranchId;
  }

  return config;
});

// Response interceptor for session expiry handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('hive_token');
        localStorage.removeItem('hive_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
