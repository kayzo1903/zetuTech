import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerSession() {
  try {
    // Call headers() synchronously at the start
    const requestHeaders = await headers();

    // Now pass it safely to your auth function
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    return {
      session,
      user: session?.user,
      userRole: (session?.user as { role?: string })?.role || "buyer",
      isAdmin: (session?.user as { role?: string })?.role === "admin",
      isAuthenticated: !!session?.user,
    };
  } catch (error) {
    console.error("Error getting server session:", error);
    return {
      session: null,
      user: null,
      userRole: "buyer",
      isAdmin: false,
      isAuthenticated: false,
    };
  }
}
