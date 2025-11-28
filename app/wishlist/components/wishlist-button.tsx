// components/wishlist/WishlistButton.tsx
"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="ghost"
      size="icon"
      disabled={loading || localLoading}
      className={`h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md transition-all ${
        isWished
          ? "bg-red-500 text-white opacity-100"
          : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleClick}
    >
      <Heart
        className={`w-4 h-4 ${isWished ? "fill-current" : ""} ${
          loading ? "animate-pulse" : ""
        }`}
      />
    </Button>
  );
}
