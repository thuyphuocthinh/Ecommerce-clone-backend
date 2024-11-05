import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
router.get("/profile", protectRoute, authController.getProfile);

export default router;
