import express from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protectRoute);
router.use(adminRoute);

router.get("/", analyticsController.getAnalyticsData);

export default router;
