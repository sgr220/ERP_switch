import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
  createUser: (user) => api.post('/auth/users', user),
  updateUser: (id, user) => api.put(`/auth/users/${id}`, user),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

export const productAPI = {
  getAll: (search) => api.get('/products', { params: { search } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const customerAPI = {
  getAll: (search) => api.get('/customers', { params: { search } }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customer) => api.post('/customers', customer),
  update: (id, customer) => api.put(`/customers/${id}`, customer),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const orderAPI = {
  getAll: (search, status) => api.get('/orders', { params: { search, status } }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (order) => api.post('/orders', order),
  update: (id, order) => api.put(`/orders/${id}`, order),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
};

export const productionOrderAPI = {
  getAll: (search, status) => api.get('/production-orders', { params: { search, status } }),
  getById: (id) => api.get(`/production-orders/${id}`),
  create: (order) => api.post('/production-orders', order),
  update: (id, order) => api.put(`/production-orders/${id}`, order),
  updateStatus: (id, status) => api.patch(`/production-orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/production-orders/${id}`),
  getStats: () => api.get('/production-orders/stats'),
};

export const stockAPI = {
  getAll: (search, type) => api.get('/stock', { params: { search, type } }),
  getById: (id) => api.get(`/stock/${id}`),
  create: (item) => api.post('/stock', item),
  update: (id, item) => api.put(`/stock/${id}`, item),
  delete: (id) => api.delete(`/stock/${id}`),
  addMovement: (movement) => api.post('/stock/movements', movement),
  getMovements: (stockItemId) => api.get('/stock/movements', { params: { stockItemId } }),
  getLowStockAlerts: () => api.get('/stock/alerts/low-stock'),
};

export default api;
