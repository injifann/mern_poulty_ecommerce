import axios from "axios";

const api = import.meta.env.VITE_API_URL;

console.log("VITE_API_URL =", api);

const axiosInstance = axios.create({
  baseURL: api,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;