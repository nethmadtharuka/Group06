// Use environment variable or fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventcraft-backend-production-b9b7.up.railway.app/api';

// Helper function to handle API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          // Try to parse as JSON first
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorText;
          } catch {
            // If not JSON, use the text as is
            errorMessage = errorText;
          }
        }
      } catch (e) {
        // If reading response fails, use default message
      }
      throw new Error(errorMessage);
    }
    
    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    
    // Try to parse as JSON, but handle plain text responses
    try {
      return JSON.parse(text) as T;
    } catch (parseError) {
      // If it's not JSON, check if it's a simple string response
      // Some endpoints return plain text (e.g., "Messages marked as seen")
      if (text.trim().length > 0) {
        // Return the text as a simple object for non-JSON responses
        return { message: text } as T;
      }
      return {} as T;
    }
  } catch (error: any) {
    // Only log errors in development
    if (import.meta.env.DEV) {
      console.error(`API call failed for ${endpoint}:`, error);
    }
    // Re-throw with a more user-friendly message if it's a network error
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
}

// User API
export const userAPI = {
  getUserActivities: async (userId: string, limit: number = 10) => {
    return apiCall(`/users/${userId}/activities?limit=${limit}`);
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) => {
    return apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (loginIdentifier: string, password: string) => {
    return apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail: loginIdentifier, password }),
    });
  },

  getUserById: async (id: string) => {
    return apiCall(`/users/${id}`);
  },

  updateUser: async (userId: string, userData: {
    fullName?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
  }) => {
    return apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  getAllUsers: async () => {
    return apiCall('/users');
  },

  deleteUser: async (userId: string) => {
    return apiCall(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Vendor API
export const vendorAPI = {
  getAllVendors: async () => {
    return apiCall('/vendors');
  },

  getVendorById: async (vendorId: string) => {
    return apiCall(`/vendors/${vendorId}`);
  },

  getVendorDetails: async (vendorId: string) => {
    return apiCall(`/vendors/${vendorId}/details`);
  },

  getVendorByUserId: async (userId: string) => {
    return apiCall(`/vendors/user/${userId}`);
  },

  registerVendor: async (userId: string, vendorData: any) => {
    return apiCall(`/vendors/register/${userId}`, {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  },

  updateVendor: async (vendorId: string, userId: string, vendorData: any) => {
    return apiCall(`/vendors/${vendorId}/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  },

  getFeaturedVendors: async (limit: number = 6) => {
    return apiCall(`/vendors/featured?limit=${limit}`);
  },
};

// Event API
export const eventAPI = {
  getAllEvents: async () => {
    return apiCall('/events');
  },

  getEventById: async (id: string) => {
    return apiCall(`/events/${id}`);
  },

  createEvent: async (eventData: {
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    location?: string;
    budget?: number;
    userId?: string;
  }) => {
    const userId = eventData.userId || localStorage.getItem('userId');
    if (userId) {
      return apiCall(`/events/user/${userId}`, {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    }
    return apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  getEventsByUser: async (userId: string) => {
    return apiCall(`/events/user/${userId}`);
  },

  getUpcomingEventsByUser: async (userId: string, limit: number = 10) => {
    return apiCall(`/events/user/${userId}/upcoming?limit=${limit}`);
  },

  deleteEvent: async (id: string) => {
    return apiCall(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  getFeaturedVendorsForEvent: async (eventId: string) => {
    return apiCall(`/events/${eventId}/featured-vendors`);
  },
};

// Review API
export const reviewAPI = {
  createReview: async (userId: string, reviewData: {
    vendorId: string;
    rating: number;
    comment?: string;
  }) => {
    return apiCall(`/reviews/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getReviewsByVendor: async (vendorId: string) => {
    return apiCall(`/reviews/vendor/${vendorId}`);
  },

  getReviewsByUser: async (userId: string) => {
    return apiCall(`/reviews/user/${userId}`);
  },

  updateReview: async (reviewId: string, userId: string, reviewData: any) => {
    return apiCall(`/reviews/${reviewId}/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  deleteReview: async (reviewId: string, userId: string) => {
    return apiCall(`/reviews/${reviewId}/user/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Chat API
export const chatAPI = {
  createOrGetChat: async (chatData: {
    vendorId: string;
    userId?: string;
    vendor2Id?: string;
  }) => {
    return apiCall('/chats', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
  },

  createOrGetVendorToVendorChat: async (vendorId1: string, vendorId2: string) => {
    return apiCall(`/chats/vendor/${vendorId1}/vendor/${vendorId2}`);
  },

  getChatById: async (chatId: string) => {
    return apiCall(`/chats/${chatId}`);
  },

  getChatByVendorAndUser: async (vendorId: string, userId: string) => {
    return apiCall(`/chats/vendor/${vendorId}/user/${userId}`);
  },

  getChatsByUser: async (userId: string) => {
    return apiCall(`/chats/user/${userId}`);
  },

  getChatsByVendor: async (vendorId: string) => {
    return apiCall(`/chats/vendor/${vendorId}`);
  },
};

// Message API
export const messageAPI = {
  sendMessage: async (messageData: {
    chatId: string;
    senderId: string;
    content: string;
    senderType?: 'USER' | 'VENDOR';
  }) => {
    // Determine sender type based on current user role
    const userRole = localStorage.getItem('userRole');
    const senderType = messageData.senderType || (userRole === 'VENDOR' ? 'VENDOR' : 'USER');
    
    return apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({
        ...messageData,
        senderType: senderType
      }),
    });
  },

  getMessagesByChat: async (chatId: string) => {
    return apiCall(`/messages/chat/${chatId}`);
  },

  markMessagesAsSeen: async (chatId: string, userId: string) => {
    return apiCall(`/messages/chat/${chatId}/mark-seen/user/${userId}`, {
      method: 'PUT',
    });
  },

  getUnreadMessageCount: async (chatId: string, userId: string) => {
    return apiCall(`/messages/chat/${chatId}/unread-count/user/${userId}`);
  },

  getUnreadMessages: async (chatId: string, userId: string) => {
    return apiCall(`/messages/chat/${chatId}/unread/user/${userId}`);
  },
};

// Contract API
export const contractAPI = {
  createContract: async (contractData: {
    userId?: string;
    contractText: string;
    eventId?: string;
    vendorId?: string;
    clientName?: string;
    companyName?: string;
    contactEmail?: string;
    phoneNumber?: string;
    address?: string;
    totalFee?: number | string;
    depositAmount?: number | string;
    paymentDeadline?: string;
    venue?: string;
  }) => {
    return apiCall('/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData),
    });
  },

  getAllContracts: async () => {
    return apiCall('/contracts');
  },

  getContractsByEvent: async (eventId: string) => {
    return apiCall(`/contracts/event/${eventId}`);
  },

  getContractsByUser: async (userId: string) => {
    return apiCall(`/contracts/user/${userId}`);
  },
};

// Vendor Package API
export const vendorPackageAPI = {
  createPackage: async (vendorId: string, packageData: any) => {
    return apiCall(`/vendor-packages/vendor/${vendorId}`, {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  },

  getPackagesByVendor: async (vendorId: string) => {
    return apiCall(`/vendor-packages/vendor/${vendorId}`);
  },

  getActivePackagesByVendor: async (vendorId: string) => {
    return apiCall(`/vendor-packages/vendor/${vendorId}/active`);
  },

  updatePackage: async (packageId: string, vendorId: string, packageData: any) => {
    return apiCall(`/vendor-packages/${packageId}/vendor/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
  },

  deletePackage: async (packageId: string, vendorId: string) => {
    return apiCall(`/vendor-packages/${packageId}/vendor/${vendorId}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    return apiCall('/admin/stats');
  },

  getPendingVendors: async () => {
    return apiCall('/admin/vendors/pending');
  },

  approveVendor: async (vendorId: string) => {
    return apiCall(`/admin/vendors/${vendorId}/approve`, {
      method: 'PUT',
    });
  },

  rejectVendor: async (vendorId: string) => {
    return apiCall(`/admin/vendors/${vendorId}/reject`, {
      method: 'PUT',
    });
  },

  getSupportChats: async () => {
    return apiCall('/admin/support/chats');
  },

  getBestVendors: async () => {
    return apiCall('/admin/vendors/best');
  },

  getGrowthReport: async () => {
    return apiCall('/admin/reports/growth');
  },
};

// Payment API
export const paymentAPI = {
  createPayment: async (paymentData: {
    contractId: string;
    amount: number | string;
    paymentMethod?: 'CARD' | 'BANK_TRANSFER' | 'PAYPAL';
  }) => {
    return apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify({
        ...paymentData,
        paymentMethod: paymentData.paymentMethod || 'CARD'
      }),
    });
  },

  getPaymentsByContract: async (contractId: string) => {
    return apiCall(`/payments/contract/${contractId}`);
  },

  getPaymentById: async (paymentId: string) => {
    return apiCall(`/payments/${paymentId}`);
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (userId: string) => {
    return apiCall(`/notifications/user/${userId}`);
  },

  getUnreadCount: async (userId: string) => {
    return apiCall(`/notifications/user/${userId}/unread-count`);
  },

  markAsRead: async (notificationId: string) => {
    return apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async (userId: string) => {
    return apiCall(`/notifications/user/${userId}/read-all`, {
      method: 'PUT',
    });
  },

  deleteNotification: async (notificationId: string) => {
    return apiCall(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
};

