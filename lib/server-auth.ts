
import { getServerSession } from "./server-session";
import { redirect } from "next/navigation";

// Re-export getServerSession for convenience
export { getServerSession };

/**
 * Get the current user session on the server side
 * Returns null if no session exists
 */
export async function getCurrentUser() {
  const { user, isAuthenticated } = await getServerSession();
  return isAuthenticated ? user : null;
}

/**
 * Get the current user session and redirect if not authenticated
 * @param redirectTo - Path to redirect to if not authenticated
 */
export async function requireAuth(redirectTo: string = "/auth/sign-in") {
  const { user, isAuthenticated } = await getServerSession();
  
  if (!isAuthenticated || !user) {
    redirect(redirectTo);
  }
  
  return user;
}

/**
 * Get the current user session and redirect if not admin
 * @param redirectTo - Path to redirect to if not admin
 */
export async function requireAdmin(redirectTo: string = "/") {
  const { user, isAdmin, isAuthenticated } = await getServerSession();
  
  if (!isAuthenticated || !user) {
    redirect("/auth/sign-in");
  }
  
  if (!isAdmin) {
    redirect(redirectTo);
  }
  
  return user;
}

/**
 * Check if the current user has a specific role
 * @param role - Role to check for
 */
export async function hasRole(role: string) {
  const { userRole } = await getServerSession();
  return userRole === role;
}

/**
 * Check if the current user is admin
 */
export async function isAdmin() {
  const { isAdmin } = await getServerSession();
  return isAdmin;
}

/**
 * Get user role
 */
export async function getUserRole() {
  const { userRole } = await getServerSession();
  return userRole;
}
