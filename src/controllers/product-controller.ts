import type { Request, Response } from "express";
import { BackendError, errorHandler } from "@/utils/errors";
import { productService } from "@/services/product-service";

export class ProductController {
  async getProduct(req: Request, res: Response) {
    try {
      const idParam = req.params.id;

      if (!idParam) {
        throw new BackendError("BAD_REQUEST", {
          message: "Product ID is required",
        });
      }

      const id = Number.parseInt(idParam);

      if (isNaN(id)) {
        throw new BackendError("BAD_REQUEST", {
          message: "Invalid product ID",
        });
      }

      const product = await productService.getProductById(id);
      res.json({ status: "success", data: product });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();

      res.json({ status: "success", data: products });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}

export const productController = new ProductController();
