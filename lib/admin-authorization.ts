// lib/admin-authorization.ts
import { getServerSession } from "./server-session";

export async function isAuthorizedAdmin() {
  const session = await getServerSession();
  const userEmail = session?.user?.email?.toLowerCase() ?? "";

  const allowedEmails =
    process.env.ALLOWED_ADMIN_EMAILS?.toLowerCase().split(",") || [];

  const isAllowed = allowedEmails.includes(userEmail);
  return { isAllowed, session };
}
