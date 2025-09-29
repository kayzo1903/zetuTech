// app/api/wishlist/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-session";
import { getUserWishlist, createWishlist, addToWishlist, removeFromWishlist, isInWishlist } from "@/app/wishlist/server/wishlistQuery";

// GET - Check if product is in wishlist
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      return NextResponse.json({
        success: true,
        isInWishlist: false
      });
    }

    const inWishlist = await isInWishlist(userWishlist.id, productId);
    
    return NextResponse.json({
      success: true,
      isInWishlist: inWishlist
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add or toggle wishlist item
export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's wishlist
    let userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      userWishlist = await createWishlist(session.user.id);
    }

    if (!userWishlist) {
      return NextResponse.json(
        { error: "Failed to access wishlist" },
        { status: 500 }
      );
    }

    // Check if item is already in wishlist
    const alreadyInWishlist = await isInWishlist(userWishlist.id, productId);

    if (alreadyInWishlist) {
      // Remove from wishlist
      const result = await removeFromWishlist(userWishlist.id, productId);
      return NextResponse.json({ 
        success: result.success, 
        action: "removed",
        message: "Item removed from wishlist" 
      });
    } else {
      // Add to wishlist
      const result = await addToWishlist(userWishlist.id, productId);
      return NextResponse.json({ 
        success: result.success, 
        action: "added",
        message: "Item added to wishlist" 
      });
    }
  } catch (error) {
    console.error("Error toggling wishlist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userWishlist = await getUserWishlist(session.user.id);
    if (!userWishlist) {
      return NextResponse.json(
        { error: "Wishlist not found" },
        { status: 404 }
      );
    }

    const result = await removeFromWishlist(userWishlist.id, productId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}