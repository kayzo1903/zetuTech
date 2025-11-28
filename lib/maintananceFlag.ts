// lib/getMaintenanceFlag.ts
import { db } from "@/db";
import { businessInfo } from "@/db/schema";

/**
 * Direct DB check for maintenance flag.
 * Edge-safe: no fetch() to your own API.
 */
export async function getMaintenanceFlag(): Promise<boolean> {
  try {
    const result = await db
      .select({ maintenance: businessInfo.maintenanceMode })
      .from(businessInfo)
      .limit(1);

    return result[0]?.maintenance ?? false;
  } catch (err) {
    console.error("Maintenance flag check failed:", err);
    return false; // fail open to avoid locking out users on error
  }
}
