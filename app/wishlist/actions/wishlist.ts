// app/wishlist/actions/wishlist.ts
"use server";
import { getServerSession } from "@/lib/server-session";
import { addToWishlist, createWishlist, getUserWishlist, getWishlistItems, isInWishlist, removeFromWishlist } from "../server/wishlistQuery";

// Get user's wishlist with items
export async function getWishlist() {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get or create wishlist for user
    let userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      userWishlist = await createWishlist(session.user.id);
    }

    if (!userWishlist) {
      return { success: false, error: "Failed to create wishlist" };
    }

    // Get wishlist items
    const items = await getWishlistItems(userWishlist.id);

    return {
      success: true,
      data: {
        wishlist: userWishlist,
        items,
      },
    };
  } catch (error) {
    console.error("Error getting wishlist:", error);
    return { success: false, error: "Failed to get wishlist" };
  }
}

// Toggle item in wishlist
export async function toggleWishlistItem(productId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Get user's wishlist
    let userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      userWishlist = await createWishlist(session.user.id);
    }

    if (!userWishlist) {
      return { success: false, error: "Failed to access wishlist" };
    }

    // Check if item is already in wishlist
    const alreadyInWishlist = await isInWishlist(userWishlist.id, productId);

    if (alreadyInWishlist) {
      // Remove from wishlist
      const result = await removeFromWishlist(userWishlist.id, productId);
      return { 
        success: result.success, 
        action: "removed",
        message: "Item removed from wishlist" 
      };
    } else {
      // Add to wishlist
      const result = await addToWishlist(userWishlist.id, productId);
      return { 
        success: result.success, 
        action: "added",
        message: "Item added to wishlist" 
      };
    }
  } catch (error) {
    console.error("Error toggling wishlist item:", error);
    return { success: false, error: "Failed to update wishlist" };
  }
}

// Remove item from wishlist
export async function removeWishlistItem(productId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      return { success: false, error: "Wishlist not found" };
    }

    const result = await removeFromWishlist(userWishlist.id, productId);
    return result;
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return { success: false, error: "Failed to remove item from wishlist" };
  }
}

// Check if product is in user's wishlist
export async function checkWishlistStatus(productId: string) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return { success: false, isInWishlist: false };
    }

    const userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      return { success: true, isInWishlist: false };
    }

    const inWishlist = await isInWishlist(userWishlist.id, productId);
    return { success: true, isInWishlist: inWishlist };
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return { success: false, isInWishlist: false };
  }
}