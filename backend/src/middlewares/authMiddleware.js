import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
    try {
        // lấy token từ header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: "Không tìm thấy access token" });
        }

        // xác nhận token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodeUser) => {
            if (err) {
                return res.status(403).json({ message: "Token hết hạn hoặc không đúng" });
            }
            // tìm user
            const user = await User.findById(decodeUser.userId).select("-hashedPassword");
            if (!user) {
                return res.status(401).json({ message: "Người dùng không tồn tại" });
            }
            // trả thông tin user vào request
            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Lỗi khi xác thực JWT trong authMiddleware", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
