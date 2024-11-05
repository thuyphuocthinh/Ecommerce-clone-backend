import express from "express";
import * as productsController from "../controllers/products.controller.js";
import { adminRoute, protectRoute } from "../middlewares/auth.middleware.js";
import { validateObjectId } from "../middlewares/validation.middleware.js";
const router = express.Router();

router.get("/all", protectRoute, adminRoute, productsController.getAllProducts);
router.get("/featured", productsController.getFeaturedProducts);
router.get("/category/:category", productsController.getProductsByCategory);
router.get("/recommendation", productsController.getRecommendedProducts);
router.post(
  "/create",
  protectRoute,
  adminRoute,
  productsController.createProduct
);

router.delete(
  "/delete/:id",
  protectRoute,
  adminRoute,
  productsController.deleteProduct
);

router.patch(
  "/:id",
  protectRoute,
  adminRoute,
  validateObjectId,
  productsController.toggleFeaturedProduct
);

export default router;
