import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protectRoute);

router.post(
  "/create-checkout-session",
  paymentController.createCheckoutSession
);

router.post("/checkout-success", paymentController.checkoutSuccess);

export default router;
