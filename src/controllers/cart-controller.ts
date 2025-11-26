import type { Request, Response } from "express";
import { z } from "zod";
import { BackendError, errorHandler } from "@/utils/errors";
import { cartService } from "@/services/cart-service";

const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});

export class CartController {
  async addToCart(req: Request, res: Response) {
    try {
      const { productId, quantity } = addToCartSchema.parse(req.body);

      const item = await cartService.addToCart(productId, quantity);

      res.status(201).json({
        status: "success",
        data: item,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  /**
   * Busca itens do carrinho com totais calculados
   * GET /api/cart
   */
  async getCart(req: Request, res: Response) {
    try {
      const cart = await cartService.getCartItems();

      res.json({ status: "success", data: cart });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  /**
   * Remove item do carrinho
   * DELETE /api/cart/:id
   */
  async removeCartItem(req: Request, res: Response) {
    try {
      const idParam = req.params.id;

      if (!idParam) {
        throw new BackendError("BAD_REQUEST", {
          message: "Cart item ID is required",
        });
      }

      const id = Number.parseInt(idParam);

      if (isNaN(id)) {
        throw new BackendError("BAD_REQUEST", {
          message: "Invalid cart item ID",
        });
      }

      await cartService.removeCartItem(id);

      res.json({ status: "success", message: "Item removed from cart" });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}

export const cartController = new CartController();
