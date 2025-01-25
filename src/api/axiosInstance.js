

// axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Debug interceptor to verify headers
const addDebugInterceptor = (instance, instanceName = 'default') => {
  instance.interceptors.request.use(
    (config) => {
      console.group(`🔍 Axios Request Debug (${instanceName})`);
      console.groupEnd();
      return config;
    }
  );
};

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosMultipartInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

// setUpInterceptors.js content moved here for clarity
const attachRequestInterceptor = (axiosCustomInstance) => {
  console.log("Response interceptor worked..")
  axiosCustomInstance.interceptors.request.use(
    (config) => {
      // Initialize headers if undefined
      config.headers = config.headers || {};
      
      if (config.url?.includes("cloudinary.com")) {
        config.withCredentials = false;
        return config;
      }
      
      const accessToken = Cookies.get("accessToken");
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
};

const attachResponseInterceptor = (axiosCustomInstance) => {
  axiosCustomInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "Token is invalid or expired." &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = Cookies.get("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }
          
          const response = await axiosInstance.post("/auth/refresh", {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          
          Cookies.set("accessToken", accessToken, { expires: 2/24 }); // 2 hours
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosCustomInstance(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          window.location.href = "/signin";
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Add debug interceptor first
addDebugInterceptor(axiosInstance, 'JSON Instance');
addDebugInterceptor(axiosMultipartInstance, 'Multipart Instance');

// Then attach request/response interceptors
attachRequestInterceptor(axiosInstance);
attachRequestInterceptor(axiosMultipartInstance);
attachResponseInterceptor(axiosInstance);
attachResponseInterceptor(axiosMultipartInstance);

export { axiosInstance, axiosMultipartInstance };