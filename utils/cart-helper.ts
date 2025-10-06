// lib/utils/cart-helpers.ts
import { dbServer } from "@/db/db-server";
import { cart, cartItem, product } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getOrCreateCart(userId?: string, sessionId?: string) {
  // let userCart; was declare but not used

  if (userId) {
    const [existing] = await dbServer
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    if (existing) return existing;

    const [newCart] = await dbServer
      .insert(cart)
      .values({ userId })
      .returning();

    return newCart;
  }

  if (sessionId) {
    const [existing] = await dbServer
      .select()
      .from(cart)
      .where(eq(cart.sessionId, sessionId));

    if (existing) return existing;

    const [newCart] = await dbServer
      .insert(cart)
      .values({ sessionId })
      .returning();

    return newCart;
  }

  throw new Error("Either userId or sessionId is required");
}

export async function getCartItems(cartId: string) {
  const items = await dbServer
    .select({
      id: cartItem.id,
      quantity: cartItem.quantity,
      price: cartItem.price,
      selectedAttributes: cartItem.selectedAttributes,
      product: {
        id: product.id,
        name: product.name,
        images: product.slug,
        stock: product.stock,
        stockStatus: product.stockStatus,
      },
    })
    .from(cartItem)
    .innerJoin(product, eq(product.id, cartItem.productId))
    .where(eq(cartItem.cartId, cartId));

  return items;
}

export async function addItemToCart({
  userId,
  sessionId,
  productId,
  quantity,
  selectedAttributes,
}: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedAttributes?: any;
}) {
  const activeCart = await getOrCreateCart(userId, sessionId);

  const [productData] = await dbServer
    .select()
    .from(product)
    .where(eq(product.id, productId));

  if (!productData) throw new Error("Product not found");
  if (productData.stock < quantity) throw new Error("Insufficient stock");

  const existing = await dbServer
    .select()
    .from(cartItem)
    .where(
      and(eq(cartItem.cartId, activeCart.id), eq(cartItem.productId, productId))
    );

  if (existing.length > 0) {
    await dbServer
      .update(cartItem)
      .set({
        quantity: existing[0].quantity + quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItem.id, existing[0].id));
  } else {
    await dbServer.insert(cartItem).values({
      cartId: activeCart.id,
      productId,
      quantity,
      price: productData.salePrice ?? productData.originalPrice,
      selectedAttributes: selectedAttributes
        ? JSON.stringify(selectedAttributes)
        : null,
    });
  }

  return await getCartItems(activeCart.id);
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) throw new Error("Quantity must be positive");
  await dbServer
    .update(cartItem)
    .set({ quantity, updatedAt: new Date() })
    .where(eq(cartItem.id, cartItemId));
}

export async function removeCartItem(cartItemId: string) {
  await dbServer.delete(cartItem).where(eq(cartItem.id, cartItemId));
}

export async function clearCart(cartId: string) {
  await dbServer.delete(cartItem).where(eq(cartItem.cartId, cartId));
}
