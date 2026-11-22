import apiClient from '../api/axios';

/**
 * Worker Portal Auth Service
 */

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', {
    role: 'WORKER',
    ...userData,
  });
  return response.data;
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch {
    return { success: true };
  }
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const sendOtp = async (phone) => {
  const response = await apiClient.post('/auth/send-otp', { phone });
  return response.data;
};

export const verifyOtp = async (phone, otp) => {
  const response = await apiClient.post('/auth/verify-otp', { phone, otp });
  return response.data;
};

export const forgotPasswordSendOtp = async (phone) => {
  const response = await apiClient.post('/auth/forgot-password/send-otp', { phone });
  return response.data;
};

export const forgotPasswordVerifyOtp = async (phone, otp) => {
  const response = await apiClient.post('/auth/forgot-password/verify-otp', { phone, otp });
  return response.data;
};

export const forgotPasswordReset = async (payload) => {
  const response = await apiClient.post('/auth/forgot-password/reset', payload);
  return response.data;
};

