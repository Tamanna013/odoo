// src/services/authService.js
import API from './api';

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response data containing user and token
 */
export const registerUser = async (name, email, password) => {
  try {
    const response = await API.post('/auth/register', {
      name,
      email,
      password
    });
    
    // Store token automatically on successful registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'Registration failed';
    throw new Error(errorMessage);
  }
};

/**
 * Login an existing user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Response data containing user and token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/auth/login', {
      email,
      password
    });
    
    // Store token automatically on successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'Login failed. Please check your credentials.';
    throw new Error(errorMessage);
  }
};

/**
 * Get current user's profile
 * @returns {Promise<Object>} - User profile data
 */
export const getProfile = async () => {
  try {
    const response = await API.get('/auth/profile');
    return response.data;
  } catch (error) {
    // Clear token if profile fetch fails (likely invalid/expired token)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    
    const errorMessage = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'Failed to fetch profile';
    throw new Error(errorMessage);
  }
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    // Optional: Call backend logout endpoint if you have one
    // await API.post('/auth/logout');
    
    // Clear local token
    localStorage.removeItem('token');
    return Promise.resolve();
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Error during logout');
  }
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @param {string} [updates.name] - New name
 * @param {string} [updates.email] - New email
 * @param {string} [updates.password] - New password
 * @param {string} [updates.profilePhoto] - New profile photo URL
 * @returns {Promise<Object>} - Updated user data
 */
export const updateProfile = async (updates) => {
  try {
    const response = await API.put('/auth/profile', updates);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'Profile update failed';
    throw new Error(errorMessage);
  }
};

/**
 * Request password reset
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Response message
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await API.post('/auth/reset-password', { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'Password reset request failed';
    throw new Error(errorMessage);
  }
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Response message
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await API.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'Password reset failed. Token may be invalid or expired.';
    throw new Error(errorMessage);
  }
};

/**
 * Refresh access token
 * @returns {Promise<Object>} - New token data
 */
export const refreshToken = async () => {
  try {
    const response = await API.post('/auth/refresh-token');
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    const errorMessage = error.response?.data?.msg || 
                       error.response?.data?.message || 
                       'Session expired. Please login again.';
    throw new Error(errorMessage);
  }
};