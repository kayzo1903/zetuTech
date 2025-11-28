// lib/utils/cart-context.ts
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/server-session";
import { cookies } from "next/headers";
import { getGuestSessionId } from "@/utils/cart-session";

export async function getCartContext() {
  const { user, isAuthenticated } = await getServerSession();

  if (isAuthenticated && user?.id) {
    return { userId: user.id, sessionId: undefined };
  }

  const cookieStore = cookies();
  let sessionId = (await cookieStore).get("guest_session_id")?.value;

  if (!sessionId) {
    sessionId = await getGuestSessionId();
    const response = NextResponse.next();
    response.cookies.set({
      name: "guest_session_id",
      value: sessionId,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      httpOnly: true,
    });
  }

  return { userId: undefined, sessionId };
}
