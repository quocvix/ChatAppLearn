import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";

export function Logout() {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button variant="completeGhost" onClick={handleLogout}>
            <LogOut className="text-destructive"/>
            Đăng Xuất
        </Button>
    );
}