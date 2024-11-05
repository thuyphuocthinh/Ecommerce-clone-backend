import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(protectRoute);

router.post("/addToCart", cartController.addToCart);
router.get("/", cartController.getCartProducts);
router.delete("/removeAll", cartController.removeAllFromCarts);
router.patch("/updateQuantity/:id", cartController.updateQuantity);

export default router;
