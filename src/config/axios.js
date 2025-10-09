import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Giới hạn thời gian (ms)
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;