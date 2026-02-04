import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:5001/api"
            : "/api",
    withCredentials: true,
});

// gắn access token vào request header
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // những api không cần check
        if (
            originalRequest.url.includes("/auth/signin") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retryCount = originalRequest._retryCount || 0;

        if (error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount += 1;

            try {
                const res = await api.post("/auth/refresh", {}, { withCredentials: true });
                const newAccessToken = res.data.accessToken;
                
                // cap nhat vao store
                useAuthStore.getState().setAccessToken(newAccessToken);
                
                // update header
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                // goi lai request
                return api(originalRequest);

            } catch (error) {
                // xoa store
                useAuthStore.getState().clearState();
                
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    },
);

export default api;
