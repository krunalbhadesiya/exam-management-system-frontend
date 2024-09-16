// src/api/ExmaData.tsx
import axiosInstance from './axios';

// Create an exam
export const createExam = async (examData: any) => {
  return await axiosInstance.post('/exams', examData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Get all exams
export const getAllExams = async () => {
  return await axiosInstance.get('/exams');
};

// Get exam by ID
export const getExamById = async (id: string) => {
  return await axiosInstance.get(`/exams/${id}`);
};

// Get exams by class
export const getExamsByClass = async (className: string) => {
  return await axiosInstance.get(`/exams/class/${className}`);
};

// Update an exam
export const updateExam = async (id: string, examData: any) => {
  return await axiosInstance.put(`/exams/${id}`, examData);
};

// Delete an exam
export const deleteExam = async (id: string) => {
  return await axiosInstance.delete(`/exams/${id}`);
};
