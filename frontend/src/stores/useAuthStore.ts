import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,
    
    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });

            // goi api
            await authService.signUp(
                username,
                password,
                email,
                firstName,
                lastName,
            );

            toast.success("Đăng ký thành công! Hãy đăng nhập");
        } catch (error) {
            console.log(error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            set({ loading: false });
        }
    },
}));