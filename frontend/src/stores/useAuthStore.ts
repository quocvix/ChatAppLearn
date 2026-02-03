import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({
            accessToken: null,
            user: null,
            loading: false,
        });
    },

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
            toast.error("Đăng ký không thành công");
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });

            // goi api
            const { accessToken, user } = await authService.signIn(
                username,
                password,
            );

            // luu vao store
            set({
                accessToken: accessToken,
            });

            toast.success("Đăng nhập thành công!");
        } catch (error) {
            console.log(error);
            toast.error("Đăng nhập không thành công");
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            set({ loading: true });

            // xoa khoi store
            get().clearState();
            
            // goi api
            await authService.signOut();

            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.log(error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            set({ loading: false });
        }
    },
}));
