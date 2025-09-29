// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-session";
import { getUserWishlist, createWishlist, getWishlistItems } from "@/app/wishlist/server/wishlistQuery";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create wishlist for user
    let userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      userWishlist = await createWishlist(session.user.id);
    }

    if (!userWishlist) {
      return NextResponse.json(
        { error: "Failed to create wishlist" },
        { status: 500 }
      );
    }

    // Get wishlist items
    const items = await getWishlistItems(userWishlist.id);

    return NextResponse.json({
      success: true,
      data: {
        wishlist: userWishlist,
        items,
      },
    });
  } catch (error) {
    console.error("Error getting wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}