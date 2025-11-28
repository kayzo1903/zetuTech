export async function mergeGuestCart(guestSessionId: string, userId: string) {
  try {
    await fetch("/api/cart/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestSessionId, userId }),
    });

    // Optionally clear guest cookie
    document.cookie =
      "guest_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (err) {
    console.error("Cart merge failed:", err);
  }
}
