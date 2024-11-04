import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";
import { connectDB } from "./src/config/database.config.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`E-commerce backend on port ${PORT}`);
});
