import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        // có thể xảy ra khi refresh trang
        if (!accessToken) {
            await refresh();
        }

        if (accessToken && !user) {
            await fetchMe();
        }
        setStarting(false);
    }

    useEffect(() => {
        init();
    }, []);

    if (starting || loading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet></Outlet>;
};

export default ProtectedRoute;
