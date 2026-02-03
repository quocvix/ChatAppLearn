export const authMe = async (req, res) => {
    try {
        const user = req.user; // user đã được gán từ authMiddleware
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin user", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};