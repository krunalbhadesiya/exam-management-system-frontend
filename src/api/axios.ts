// // src/api/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // Handle token expiration (e.g., redirect to login or refresh token)
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5000/api', // your backend API base URL
// });

// export default axiosInstance;
