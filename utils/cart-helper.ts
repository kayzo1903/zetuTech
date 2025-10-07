// utils/cart-helpers.ts
import { dbServer } from "@/db/db-server";
import { cart, cartItem, product } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { CartItem } from "@/lib/cart/types";

/**
 * Get or create cart for user or guest
 */
export async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    // Try to find user's active cart
    const [userCart] = await dbServer
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), sql`expires_at > NOW()`))
      .orderBy(desc(cart.createdAt))
      .limit(1);

    if (userCart) return userCart;

    // Create new cart for user
    const [newCart] = await dbServer
      .insert(cart)
      .values({
        userId,
        expiresAt: sql`NOW() + INTERVAL '30 days'`,
      })
      .returning();

    return newCart;
  }

  if (sessionId) {
    // Try to find guest cart
    const [guestCart] = await dbServer
      .select()
      .from(cart)
      .where(and(eq(cart.sessionId, sessionId), sql`expires_at > NOW()`))
      .orderBy(desc(cart.createdAt))
      .limit(1);

    if (guestCart) return guestCart;

    // Create new cart for guest
    const [newCart] = await dbServer
      .insert(cart)
      .values({
        sessionId,
        expiresAt: sql`NOW() + INTERVAL '30 days'`,
      })
      .returning();

    return newCart;
  }

  throw new Error("Either userId or sessionId is required");
}

/**
 * Get cart items with minimal product data
 */
export async function getCartItems(cartId: string): Promise<CartItem[]> {
  const items = await dbServer
    .select({
      id: cartItem.id,
      cartId: cartItem.cartId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.price,
      selectedAttributes: cartItem.selectedAttributes,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: sql<string>`COALESCE(
          (SELECT url FROM product_image WHERE product_id = product.id ORDER BY "order" LIMIT 1),
          '/placeholder-product.jpg'
        )`.as("image"),
        stock: product.stock,
        status: product.status,
      },
    })
    .from(cartItem)
    .innerJoin(product, eq(cartItem.productId, product.id))
    .where(eq(cartItem.cartId, cartId))
    .orderBy(desc(cartItem.createdAt));

  return items.map((item) => ({
    id: item.id,
    cartId: item.cartId,
    productId: item.productId,
    quantity: item.quantity,
    price: Number(item.price), // Convert decimal to number for frontend
    selectedAttributes: item.selectedAttributes
      ? JSON.parse(item.selectedAttributes)
      : undefined,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      image: item.product.image,
      stock: item.product.stock,
      status: item.product.status,
      originalPrice: 0,
      salePrice: null,
      hasDiscount: false,
    },
  }));
}

/**
 * Add item to cart with validation - FIXED DECIMAL HANDLING
 */
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
  // Validate quantity
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  // Get or create cart
  const activeCart = await getOrCreateCart(userId, sessionId);

  // Check product existence and availability
  const [productData] = await dbServer
    .select({
      id: product.id,
      name: product.name,
      originalPrice: product.originalPrice,
      salePrice: product.salePrice,
      stock: product.stock,
      status: product.status,
    })
    .from(product)
    .where(eq(product.id, productId));

  if (!productData) {
    throw new Error("Product not found");
  }

  // Check if product is available for purchase
  const availableStatuses = ["active", "published"];
  if (!availableStatuses.includes(productData.status.toLowerCase())) {
    throw new Error("Product is not available for purchase");
  }

  // Check stock availability
  if (productData.stock < quantity) {
    throw new Error(`Only ${productData.stock} items available in stock`);
  }

  // Check for existing item with same attributes
  const attributeFilter = selectedAttributes
    ? eq(cartItem.selectedAttributes, JSON.stringify(selectedAttributes))
    : sql`${cartItem.selectedAttributes} IS NULL`;

  const existingItems = await dbServer
    .select()
    .from(cartItem)
    .where(
      and(
        eq(cartItem.cartId, activeCart.id),
        eq(cartItem.productId, productId),
        attributeFilter
      )
    );

  // ✅ FIX: Convert decimal to string for database insertion
  const finalPrice = (productData.salePrice ?? productData.originalPrice).toString();

  if (existingItems.length > 0) {
    // Update existing item
    const existingItem = existingItems[0];
    const newQuantity = existingItem.quantity + quantity;

    // Check stock again for updated quantity
    if (productData.stock < newQuantity) {
      throw new Error(`Only ${productData.stock} items available in stock`);
    }

    await dbServer
      .update(cartItem)
      .set({
        quantity: newQuantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItem.id, existingItem.id));
  } else {
    // Add new item - ✅ FIX: price must be string for decimal column
    await dbServer.insert(cartItem).values({
      cartId: activeCart.id,
      productId,
      quantity,
      price: finalPrice, // ✅ Now passing as string
      selectedAttributes: selectedAttributes
        ? JSON.stringify(selectedAttributes)
        : null,
    });
  }

  // Return updated cart items
  return await getCartItems(activeCart.id);
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    await removeCartItem(cartItemId);
    return;
  }

  // Get current cart item with minimal product data
  const [currentItem] = await dbServer
    .select({
      cartItem: cartItem,
      product: {
        id: product.id,
        stock: product.stock,
        status: product.status,
      },
    })
    .from(cartItem)
    .innerJoin(product, eq(cartItem.productId, product.id))
    .where(eq(cartItem.id, cartItemId))
    .limit(1);

  if (!currentItem) {
    throw new Error("Cart item not found");
  }

  // Check product availability
  const availableStatuses = ["active", "published"];
  if (!availableStatuses.includes(currentItem.product.status.toLowerCase())) {
    throw new Error("Product is no longer available");
  }

  if (currentItem.product.stock < quantity) {
    throw new Error(
      `Only ${currentItem.product.stock} items available in stock`
    );
  }

  await dbServer
    .update(cartItem)
    .set({
      quantity,
      updatedAt: new Date(),
    })
    .where(eq(cartItem.id, cartItemId));
}

/**
 * Remove item from cart
 */
export async function removeCartItem(cartItemId: string) {
  const result = await dbServer
    .delete(cartItem)
    .where(eq(cartItem.id, cartItemId))
    .returning();

  if (result.length === 0) {
    throw new Error("Cart item not found");
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(cartId: string) {
  await dbServer.delete(cartItem).where(eq(cartItem.cartId, cartId));
}

/**
 * Merge guest cart into user cart - FIXED DECIMAL HANDLING
 */
export async function mergeCarts(guestSessionId: string, userId: string) {
  return await dbServer.transaction(async (tx) => {
    const [guestCart] = await tx
      .select()
      .from(cart)
      .where(eq(cart.sessionId, guestSessionId));

    if (!guestCart) return [];

    const [userCart] = await tx
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    const guestItems = await getCartItems(guestCart.id);

    if (userCart) {
      for (const guestItem of guestItems) {
        const attributeFilter = guestItem.selectedAttributes
          ? eq(
              cartItem.selectedAttributes,
              JSON.stringify(guestItem.selectedAttributes)
            )
          : sql`${cartItem.selectedAttributes} IS NULL`;

        const existingUserItems = await tx
          .select()
          .from(cartItem)
          .where(
            and(
              eq(cartItem.cartId, userCart.id),
              eq(cartItem.productId, guestItem.productId),
              attributeFilter
            )
          );

        if (existingUserItems.length > 0) {
          await tx
            .update(cartItem)
            .set({
              quantity: existingUserItems[0].quantity + guestItem.quantity,
              updatedAt: new Date(),
            })
            .where(eq(cartItem.id, existingUserItems[0].id));
        } else {
          await tx.insert(cartItem).values({
            cartId: userCart.id,
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            price: guestItem.price.toString(),
            selectedAttributes: guestItem.selectedAttributes
              ? JSON.stringify(guestItem.selectedAttributes)
              : null,
          });
        }
      }

      await tx.delete(cart).where(eq(cart.id, guestCart.id));
      return await getCartItems(userCart.id);
    } else {
      await tx
        .update(cart)
        .set({ userId, sessionId: null })
        .where(eq(cart.id, guestCart.id));
      return guestItems;
    }
  });
}
