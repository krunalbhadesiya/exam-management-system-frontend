// src/api/QuestionData.tsx
import axiosInstance from './axios';

// Create a question
export const createQuestion = async (questionData: any) => {
  return await axiosInstance.post('/questions', questionData);
};

// Get all questions
export const getAllQuestions = async () => {
  return await axiosInstance.get('/questions');
};

// Get question by ID
export const getQuestionById = async (id: string) => {
  return await axiosInstance.get(`/questions/${id}`);
};

// Get questions by exam ID
export const getQuestionsByExamId = async (examId: string) => {
  return await axiosInstance.get(`/questions/exam/${examId}`);
};

// Update a question
export const updateQuestion = async (id: string, questionData: any) => {
  return await axiosInstance.put(`/questions/${id}`, questionData);
};

// Delete a question
export const deleteQuestion = async (id: string) => {
  return await axiosInstance.delete(`/questions/${id}`);
};
