import axios from "axios";
import { dynamicEncrypt, dynamicDecrypt } from "../utils/autoCrypto.js";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
      if (config.data.email && !config.data.rawEmail) {
        config.data.rawEmail = config.data.email;
      }

      const rawEmail = config.data.rawEmail;
      const dataToEncrypt = { ...config.data };
      delete dataToEncrypt.rawEmail;

      config.data = dynamicEncrypt(dataToEncrypt);

      if (rawEmail) {
        config.data.rawEmail = rawEmail;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object") {
      response.data = dynamicDecrypt(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.data && typeof error.response.data === "object") {
      error.response.data = dynamicDecrypt(error.response.data);
    }
    return Promise.reject(error);
  }
);

