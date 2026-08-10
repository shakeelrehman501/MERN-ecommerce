import axios from "axios";
// import { BASE_URL } from "../lib/constants.js";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export default api;
