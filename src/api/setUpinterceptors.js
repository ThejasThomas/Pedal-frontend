import Cookies from "js-cookie";
import { axiosInstance } from "./axiosInstance";

const attachRequestInterceptor = (axiosCustomInstance) => {
  axiosCustomInstance.interceptors.request.use(
    (config) => {


      console.group('Request Interceptor Debug');

      
      if (config.url.includes("cloudinary.com")) {
        config.withCredentials = false;
        return config;
      }

      const accessToken = Cookies.get("accessToken");
      
      // if (accessToken) {
      //   config.headers.Authorization = `Bearer ${accessToken}`;
      // }
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn('No access token found');
      }
      

      return config;
    },
    (error) => Promise.reject(error)
  );
};
const attachResponseInterceptor = (axiosCustomInstance, refreshEndpoint) => {
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
  
            const response = await axiosInstance.post(refreshEndpoint, {
              refreshToken,
            });
  
            const { accessToken } = response.data;
  
            Cookies.set("accessToken", accessToken, { expires: 2/24 });
  
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

export { attachRequestInterceptor,attachResponseInterceptor };