import express from "express";
import * as authController from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
// router.get("/profile", authController.getProfile);

export default router;
