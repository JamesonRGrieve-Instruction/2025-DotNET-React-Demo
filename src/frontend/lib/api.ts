import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
});

api.interceptors.request.use((config) => {
  const jwt = getCookie("jwt");
  if (jwt) {
    config.headers.Authorization = `Bearer: ${jwt}`;
  }
  return config;
});

export default api;
