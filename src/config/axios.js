<<<<<<< HEAD
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://68d2aeb4cc7017eec544da0a.mockapi.io/',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// export default api;
=======
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Giới hạn thời gian (ms)
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
>>>>>>> main
