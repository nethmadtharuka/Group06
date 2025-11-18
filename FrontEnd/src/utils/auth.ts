/**
 * Logout function that clears user session and redirects to login
 */
export const logout = () => {
  // Clear all user data from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  
  // Redirect to login page
  window.location.href = '/login';
};

