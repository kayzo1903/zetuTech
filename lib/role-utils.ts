export const ROLES = {
  ADMIN: "admin",
  BUYER: "buyer",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    "admin.dashboard",
    "admin.products.create",
    "admin.products.edit",
    "admin.products.delete",
    "admin.orders.view",
    "admin.orders.manage",
    "admin.users.view",
    "admin.users.manage",
    "admin.settings",
  ],
  [ROLES.BUYER]: [
    "products.view",
    "orders.create",
    "orders.view",
    "profile.edit",
  ],
} as const;

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission as never);
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === ROLES.ADMIN;
}

export function isBuyer(userRole: UserRole): boolean {
  return userRole === ROLES.BUYER;
}
