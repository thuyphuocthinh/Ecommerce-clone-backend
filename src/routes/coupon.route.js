import express from "express";
import * as couponController from "../controllers/coupon.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protectRoute);

router.get("/", couponController.getCoupon);
router.get("/validate", couponController.validateCoupon);

export default router;
