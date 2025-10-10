const API_BASE_URL = 'http://localhost:8081/api';

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
};

// Vendor APIs
export const vendorAPI = {
  getAll: () => apiCall('/vendors'),
  register: (userId, vendorData) => apiCall(`/vendors/register/${userId}`, {
    method: 'POST',
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
};

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
