import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Request Interceptor (Fixed: Removed Duplicate)
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = JSON.parse(localStorage.getItem('user'))?.token;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            } else if (error.response.status === 500) {
                console.error("Server error, Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.log("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;



//