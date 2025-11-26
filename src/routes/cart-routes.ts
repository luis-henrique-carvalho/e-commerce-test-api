import { Router } from "express";
import { cartController } from "@/controllers/cart-controller";

const router = Router();

router.get("/", (req, res) => cartController.getCart(req, res));
router.post("/add", (req, res) => cartController.addToCart(req, res));
router.delete("/:id", (req, res) => cartController.removeCartItem(req, res));

export default router;
