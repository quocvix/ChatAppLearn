import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
// import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());

// public routes
app.use("/api/auth", authRoute);

// private routes
// app.use("/api/users", userRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server chạy port ${PORT}`);
    });
});
