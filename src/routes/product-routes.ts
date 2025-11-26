import { Router } from "express";
import { productController } from "@/controllers/product-controller";

const router = Router();

router.get("/", (req, res) => productController.getAllProducts(req, res));
router.get("/:id", (req, res) => productController.getProduct(req, res));

export default router;
