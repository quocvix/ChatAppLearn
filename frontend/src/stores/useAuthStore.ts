import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    setAccessToken: (accessToken) => {
        set({ accessToken });
    },

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
            const { accessToken } = await authService.signIn(
                username,
                password,
            );

            // luu vao store
            get().setAccessToken(accessToken);

            // lay thong tin nguoi dung
            await get().fetchMe();

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

    fetchMe: async () => {
        try {
            set({ loading: true });

            // goi api
            const user = await authService.fetchMe();

            // luu vao store
            set({ user });

            toast.success("Lấy thông tin người dùng thành công!");
        } catch (error) {
            console.log(error);
            set({ user: null, accessToken: null });
            toast.error("Lấy thông tin người dùng không thành công");
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            set({ loading: true });
            const {user, fetchMe} = get();
            
            // goi api
            const accessToken = await authService.refresh();

            // cap nhat vao store
            get().setAccessToken(accessToken);
            
            if (!user) {
                await fetchMe();
            }

        } catch (error) {
            console.log(error);
            get().clearState();
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        } finally {
            set({ loading: false });
        }
    },
}));
