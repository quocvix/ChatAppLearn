import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // thường là dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        if (!username || !email || !password || !firstName || !lastName) {
            return res
                .status(400)
                .json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }

        // kiểm tra username tồn tại chưa
        const duplicate = await User.findOne({ username });
        if (duplicate) {
            return res
                .status(409)
                .json({ message: "Tên đăng nhập đã tồn tại" });
        }

        // mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10 là số vòng lặp

        // tạo user mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${lastName} ${firstName}`,
        });

        // return
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi gọi signUp", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const signIn = async (req, res) => {
    try {
        // lấy inputs
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }

        // lấy hashedPassword trong db để so với password input
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(401)
                .json({
                    message: "Tên đăng nhập hoặc mật khẩu không chính xác",
                });
        }

        // kiểm tra password có khớp với hashedPassword không
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    message: "Tên đăng nhập hoặc mật khẩu không chính xác",
                });
        }

        // nếu khớp, tạo access token với JWT
        const accessToken = jwt.sign(
            { userId: user._id },

            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        // tạo session mới để lưu refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        // trả refresh token về trong cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", // backend và frontend khác domain nên dùng none
            maxAge: REFRESH_TOKEN_TTL,
        });

        // trả access token về trong response
        return res.status(200).json({ message: `User ${user.displayName} đăng nhập thành công`, accessToken });
    } catch (error) {
        console.error("Lỗi gọi signIn", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const signOut = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            // xóa refresh token trong session
            await Session.deleteOne({ refreshToken: token });

            // xóa cookie
            res.clearCookie("refreshToken");
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi gọi signOut", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        // lấy refresh token từ cookie
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Refresh token không tồn tại" });
        }

        // so sánh refresh token trong db
        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            return res.status(403).json({ message: "Refresh token không hợp lệ" });
        }

        // kiểm tra session đã hết hạn chưa
        if (session.expiresAt < new Date()) {
            return res.status(403).json({ message: "Refresh token đã hết hạn" });
        }

        // tạo access token mới
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        // trả access token về trong response
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error("Lỗi gọi refreshToken", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};