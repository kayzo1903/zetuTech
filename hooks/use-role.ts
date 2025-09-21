"use client";

import { useSession } from "@/lib/auth-client";

export function useRole() {
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const userRole = (user as { role?: string })?.role || "buyer";
  const isAdmin = userRole === "admin";
  const isBuyer = userRole === "buyer";

  const hasRole = (role: string) => {
    return userRole === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.includes(userRole);
  };

  return {
    user,
    userRole,
    isAdmin,
    isBuyer,
    hasRole,
    hasAnyRole,
    isPending,
    isAuthenticated: !!user,
  };
}
