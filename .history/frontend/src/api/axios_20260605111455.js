import axios from "axios";

const api = axios.create({
  baseURL: "https://task1-q2f5.onrender.com//api",
  withCredentials: true, 
});

export default api;