const API_BASE_URL = 'http://localhost:8081/api';

// Simple client-side auth helpers for storing user id
export const auth = {
  storageKey: 'eventcraft_auth', // stores JSON { token, user }
  saveAuth: ({ token, user }) => {
    try {
      localStorage.setItem(auth.storageKey, JSON.stringify({ token, user }));
    } catch (e) {
      console.warn('Failed to save auth', e);
    }
  },
  getAuth: () => {
    try {
      const raw = localStorage.getItem(auth.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  getToken: () => {
    try {
      const a = auth.getAuth();
      return a ? a.token : null;
    } catch (e) {
      return null;
    }
  },
  getUser: () => {
    try {
      const a = auth.getAuth();
      return a ? a.user : null;
    } catch (e) {
      return null;
    }
  },
  clearAuth: () => {
    try {
      localStorage.removeItem(auth.storageKey);
    } catch (e) {
      // ignore
    }
  }
};

// Generic API call function that attaches Authorization header when available
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = auth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// User APIs
export const userAPI = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  create: (userData) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  // register endpoint for your backend
  register: (userData) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
  // login expects { usernameOrEmail, password } -> returns user object with id
  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  // Password reset APIs
  forgotPassword: (email) => apiCall('/users/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  validateResetToken: (token) => apiCall(`/users/validate-reset-token?token=${token}`),
  resetPassword: (resetData) => apiCall('/users/reset-password', {
    method: 'POST',
    body: JSON.stringify(resetData),
  }),
  
  // Profile Management APIs
  getProfile: (userId) => apiCall(`/users/${userId}/profile`),
  updateProfile: (userId, profileData) => apiCall(`/users/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  uploadProfilePicture: async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = auth.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    return fetch(`${API_BASE_URL}/users/${userId}/profile/picture`, {
      method: 'POST',
      headers,
      body: formData,
    });
  },
  deleteProfilePicture: (userId) => apiCall(`/users/${userId}/profile/picture`, {
    method: 'DELETE',
  }),
  getProfilePicture: (filename) => `${API_BASE_URL}/users/profile/picture/${filename}`,
};

// Vendor APIs
export const vendorAPI = {
  getAll: () => apiCall('/vendors'),
  register: (userId, vendorData) => apiCall(`/vendors/register/${userId}`, {
    method: 'POST',
    body: JSON.stringify(vendorData),
  }),
  getUserVendor: (userId) => apiCall(`/vendors/user/${userId}`),
  updateVendor: (userId, vendorData) => apiCall(`/vendors/update/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(vendorData),
  }),
};

// Event APIs
export const eventAPI = {
  getAll: () => apiCall('/events'),
  getById: (id) => apiCall(`/events/${id}`),
  create: (eventData) => apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  getByUser: (userId) => apiCall(`/events/user/${userId}`),
};

// Contract APIs
export const contractAPI = {
  // Use the root /contracts endpoint (no /api prefix)
  getAll: async () => {
    const token = auth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch('http://localhost:8080/contracts', { headers });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },
  // create needs to post to the root server path (no /api prefix)
  create: async (contractData) => {
    const token = auth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch('http://localhost:8080/contracts', {
      method: 'POST',
      headers,
      body: JSON.stringify(contractData),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  },
  // Additional contract methods
  getUserContracts: (userId) => apiCall(`/contracts/user/${userId}`),
  createContract: (contractData) => {
    const user = auth.getUser();
    const headers = {
      'Content-Type': 'application/json',
      ...(user && user.id ? { 'X-User-ID': user.id } : {})
    };
    
    return fetch(`${API_BASE_URL}/contracts/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(contractData),
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    });
  },
  updateContractStatus: (contractId, signed) => apiCall(`/contracts/${contractId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ signed }),
  }),
  deleteContract: (contractId) => apiCall(`/contracts/${contractId}`, {
    method: 'DELETE',
  }),
  getContractById: (contractId) => apiCall(`/contracts/${contractId}`),
};

// Chatbot APIs
export const chatbotAPI = {
  ask: (message, userId) => apiCall('/chatbot/ask', {
    method: 'POST',
    body: JSON.stringify({ userId, message }),
  }),
};

// Calendar APIs
export const calendarAPI = {
  getByUser: (userId) => apiCall(`/calendar/${userId}`),
  addEvent: (eventData) => apiCall('/calendar', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  // Additional calendar methods
  getUpcomingEvents: (userId, limit = 10) => apiCall(`/calendar/upcoming-events/${userId}?limit=${limit}`),
  checkAvailability: (dateSelection) => apiCall('/calendar/check-availability', {
    method: 'POST',
    body: JSON.stringify(dateSelection),
  }),
  validateDate: (dateSelection) => apiCall('/calendar/validate-date', {
    method: 'POST',
    body: JSON.stringify(dateSelection),
  }),
};

// Contact APIs
export const contactAPI = {
  submitForm: (contactData) => apiCall('/contact/submit', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
  healthCheck: () => apiCall('/contact/health'),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => apiCall('/admin/dashboard/stats'),
  getAllUsers: () => apiCall('/admin/users'),
  getUserById: (id) => apiCall(`/admin/users/${id}`),
  updateUser: (id, userData) => apiCall(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  deleteUser: (id) => apiCall(`/admin/users/${id}`, {
    method: 'DELETE',
  }),
  updateUserRole: (id, role) => apiCall(`/admin/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  }),
  getAllEvents: () => apiCall('/admin/events'),
  getEventById: (id) => apiCall(`/admin/events/${id}`),
  updateEvent: (id, eventData) => apiCall(`/admin/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  deleteEvent: (id) => apiCall(`/admin/events/${id}`, {
    method: 'DELETE',
  }),
  getAllVendors: () => apiCall('/admin/vendors'),
  getVendorById: (id) => apiCall(`/admin/vendors/${id}`),
  updateVendor: (id, vendorData) => apiCall(`/admin/vendors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vendorData),
  }),
  deleteVendor: (id) => apiCall(`/admin/vendors/${id}`, {
    method: 'DELETE',
  }),
  getSettings: () => apiCall('/admin/settings'),
  updateSettings: (settings) => apiCall('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  getLogs: () => apiCall('/admin/logs'),
};

// Default export for easier imports
const api = {
  get: (endpoint) => apiCall(endpoint),
  post: (endpoint, data) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiCall(endpoint, {
    method: 'DELETE',
  }),
  user: userAPI,
  vendor: vendorAPI,
  event: eventAPI,
  contract: contractAPI,
  chatbot: chatbotAPI,
  calendar: calendarAPI,
  contact: contactAPI,
  admin: adminAPI,
  auth: auth,
};

export default api;
