// src/api/ReportData.tsx
import axiosInstance from './axios';

// Create a report
export const createReport = async (reportData: any) => {
  return await axiosInstance.post('/reports', reportData);
};

// Get all reports
export const getAllReports = async () => {
  return await axiosInstance.get('/reports');
};

// Get report by ID
export const getReportById = async (id: string) => {
  return await axiosInstance.get(`/reports/${id}`);
};

// Get report by student username
export const getReportByStudentUsername = async (username: string) => {
  return await axiosInstance.get(`/reports/studentUsername/${username}`);
};

// Update a report
export const updateReport = async (id: string, reportData: any) => {
  return await axiosInstance.put(`/reports/${id}`, reportData);
};

// Delete a report
export const deleteReport = async (id: string) => {
  return await axiosInstance.delete(`/reports/${id}`);
};
