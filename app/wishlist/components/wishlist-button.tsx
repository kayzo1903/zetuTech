// components/wishlist/WishlistButton.tsx
"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useWishlistStore } from "@/store/wishlist-store";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { items, toggleItem, loading } = useWishlistStore();
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [localLoading, setLocalLoading] = useState(false);

  const isWished = items.includes(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to save items.", {
        action: {
          label: "Sign in",
          onClick: () => router.push("/auth/sign-in"),
        },
      });
      return;
    }

    if (loading || localLoading) return;

    setLocalLoading(true);
    await toggleItem(productId);
    setLocalLoading(false);

    toast.success(
      isWished ? "Removed from wishlist." : "Added to your wishlist!",
      {
        action: {
          label: "Go to Wishlist",
          onClick: () => router.push("/wishlist"),
        },
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || localLoading}
      className={`p-2 rounded-full transition-colors ${
        isWished
          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <Heart className={`h-5 w-5 ${isWished ? "fill-current" : ""}`} />
    </button>
  );
}
