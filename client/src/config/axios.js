import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { APP_API } from ".";

const checkTokenExpiry = (token) => {
  if (!token) return true;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp < currentTime;
};

const instance = axios.create({
  baseURL: APP_API,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && checkTokenExpiry(token)) {
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
