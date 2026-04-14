import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  adminLogin: (data) => api.post('/auth/admin-login', data),
  voterLogin: (data) => api.post('/auth/voter-login', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const voterApi = {
  getAll: () => api.get('/voters'),
  getProfile: () => api.get('/voters/me'),
  create: (data) => api.post('/voters', data),
  update: (id, data) => api.put(`/voters/${id}`, data),
  delete: (id) => api.delete(`/voters/${id}`),
};

export const candidateApi = {
  getAll: () => api.get('/candidates'),
  getByElection: (electionId) => api.get(`/candidates/election/${electionId}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
};

export const electionApi = {
  getAll: () => api.get('/elections'),
  getActive: () => api.get('/elections/active'),
  create: (data) => api.post('/elections', data),
  update: (id, data) => api.put(`/elections/${id}`, data),
  delete: (id) => api.delete(`/elections/${id}`),
};

export const voteApi = {
  cast: (data) => api.post('/vote/cast', data),
  getStatus: (electionId) => api.get(`/vote/status/${electionId}`),
};

export const resultApi = {
  getStats: () => api.get('/results/stats'),
  getElectionResults: (electionId) => api.get(`/results/${electionId}`),
  getWinner: (electionId) => api.get(`/results/${electionId}/winner`),
};

export default api;
