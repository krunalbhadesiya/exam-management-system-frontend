// src/api/StudentData.tsx
import axiosInstance from './axios';

// Register a user
export const registerUser = async (userData: any) => {
  return await axiosInstance.post('/auth/register', userData);
};

// Login a user
export const loginUser = async (userData: any) => {
  return await axiosInstance.post('/auth/login', userData);
};

// Get all users
export const getAllUsers = async () => {
  return await axiosInstance.get('/users');
};

// Get user by ID
export const getUserById = async (id: string) => {
  return await axiosInstance.get(`/users/${id}`);
};

// Update user
export const updateUser = async (id: string, userData: any) => {
  return await axiosInstance.put(`/users/${id}`, userData);
};

// Delete user
export const deleteUser = async (id: string) => {
  return await axiosInstance.delete(`/users/${id}`);
};
