// src/axios.js
import axios from "axios";
import keycloak from "../Keycloak/Keycloak";

const instance = axios.create({
  baseURL: "http://localhost:8787/api",
});

instance.interceptors.request.use(
  async (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
