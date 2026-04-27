import axios from 'axios';

// Single shared Axios instance — all modules use this
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// Global 401 handler — clear token, redirect to login (guard against loop)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)           => api.post('/auth/register', data),
  login:    (data)           => api.post('/auth/login', data),
  getMe:    ()               => api.get('/auth/me'),
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile:       ()       => api.get('/user/profile'),
  updateProfile:    (data)   => api.put('/user/profile', data),
  saveScheme:       (id)     => api.post(`/user/saved-schemes/${id}`),
  removeSavedScheme:(id)     => api.delete(`/user/saved-schemes/${id}`),
};

// ── Schemes ───────────────────────────────────────────────────────────────────
export const schemesAPI = {
  /**
   * Get all schemes with server-side filtering.
   * params: { category, state, gender, maxIncome, page, limit, sort, lang }
   * - state:    Indian state name  OR  'All'
   * - gender:   'all' | 'male' | 'female' | 'other'
   * - maxIncome: number (user's income — backend returns schemes the user can afford)
   */
  getAll:       (params)     => api.get('/schemes', { params }),

  getById:      (id, lang)   => api.get(`/schemes/${id}`, { params: { lang } }),

  /**
   * Full-text search with optional state/gender refinement.
   * params: { q, state, gender, category, page, limit, lang }
   */
  search:       (q, params)  => api.get('/schemes/search', { params: { q, ...params } }),

  getCategories: ()          => api.get('/schemes/categories'),

  /**
   * Get states that have at least one scheme.
   * Returns: { allIndiaSchemes, stateSpecific: [{state, schemeCount}], allStates }
   */
  getStates:    ()           => api.get('/schemes/states'),

  /**
   * Get gender-wise scheme summary counts.
   * Returns: { summary: [{gender, schemeCount, label}] }
   */
  getGenders:   ()           => api.get('/schemes/genders'),

  // Admin
  create:       (data)       => api.post('/schemes', data),
  update:       (id, data)   => api.put(`/schemes/${id}`, data),
  delete:       (id)         => api.delete(`/schemes/${id}`),
};

// ── Recommendations ───────────────────────────────────────────────────────────
export const recommendationsAPI = {
  get:               (params) => api.get('/recommendations', { params }),
  getSummary:        ()       => api.get('/recommendations/summary'),
  checkEligibility:  (id)     => api.get(`/recommendations/check/${id}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getAnalytics:      ()       => api.get('/admin/analytics'),
  getAllSchemes:      (params) => api.get('/admin/schemes', { params }),
  getUserById:       (id)     => api.get(`/admin/users/${id}`),
  toggleUserStatus:  (id)     => api.patch(`/admin/users/${id}/toggle-status`),
  bulkToggleSchemes: (data)   => api.patch('/admin/schemes/bulk-status', data),
};

export default api;
