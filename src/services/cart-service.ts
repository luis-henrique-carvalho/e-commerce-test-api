import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, carts, products } from "@/db/schema";
import { BackendError } from "@/utils/errors";

export class CartService {
  private cartId: string | null = null;

  private async getCart() {
    if (this.cartId) {
      const existingCart = await db.query.carts.findFirst({
        where: eq(carts.id, this.cartId),
      });

      if (existingCart) return existingCart;
    }

    const [newCart] = await db.insert(carts).values({}).returning();

    if (!newCart) {
      throw new BackendError("INTERNAL_ERROR", {
        message: "Failed to create cart",
      });
    }

    this.cartId = newCart.id;
    return newCart;
  }

  public async addToCart(productId: number, quantity: number) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new BackendError("NOT_FOUND", { message: "Product not found" });
    }

    const cart = await this.getCart();

    const existingItem = await db.query.cartItems.findFirst({
      where: (cartItems, { eq, and }) =>
        and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)),
    });

    if (existingItem) {
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();

      return updatedItem;
    }

    const [newItem] = await db
      .insert(cartItems)
      .values({ cartId: cart.id, productId, quantity })
      .returning();

    return newItem;
  }

  public async getCartItems() {
    const cart = await this.getCart();

    const cartData = await db.query.carts.findFirst({
      where: eq(carts.id, cart.id),
      with: {
        cartItems: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!cartData) {
      return {
        items: [],
        totalInCents: 0,
        itemCount: 0,
      };
    }

    const items = cartData.cartItems.map((item) => {
      const product = item.product;
      const unitPrice = product.promotionalPriceInCents ?? product.priceInCents;
      const subtotalInCents = unitPrice * item.quantity;

      return {
        id: item.id,
        quantity: item.quantity,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          priceInCents: product.priceInCents,
          promotionalPriceInCents: product.promotionalPriceInCents,
        },
        unitPriceInCents: unitPrice,
        subtotalInCents,
      };
    });

    const totalInCents = items.reduce(
      (acc, item) => acc + item.subtotalInCents,
      0
    );

    return {
      items,
      totalInCents,
      itemCount: items.length,
    };
  }

  public async removeCartItem(itemId: number) {
    const cart = await this.getCart();

    const item = await db.query.cartItems.findFirst({
      where: (cartItems, { eq, and }) =>
        and(eq(cartItems.id, itemId), eq(cartItems.cartId, cart.id)),
    });

    if (!item) {
      throw new BackendError("NOT_FOUND", { message: "Cart item not found" });
    }

    const [deleted] = await db
      .delete(cartItems)
      .where(eq(cartItems.id, itemId))
      .returning();

    return deleted;
  }
}

export const cartService = new CartService();
