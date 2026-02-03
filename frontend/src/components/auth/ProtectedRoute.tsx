import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
    const { accessToken, user, loading } = useAuthStore();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet></Outlet>;
};

export default ProtectedRoute;
