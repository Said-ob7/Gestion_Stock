// src/axios.js
import axios from "axios";
import keycloak from "./Keycloak/Keycloak";

const instance = axios.create({
  baseURL: "http://localhost:8787/api/v1",
});

instance.interceptors.request.use(
  async (config) => {
    const token = keycloak.idToken;
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
