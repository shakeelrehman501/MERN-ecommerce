import axios from "axios";
import { BASE_URL } from "../lib/constants.js";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export default api;
