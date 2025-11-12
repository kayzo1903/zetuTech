// lib/maintenance-cache.ts
let cachedValue: boolean | null = null; 
let lastFetched = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function getMaintenanceFlag(): Promise<boolean> {
  const now = Date.now();

  // Use cached value if still valid
  if (cachedValue !== null && now - lastFetched < CACHE_TTL) {
    return cachedValue;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/system/maintenance`, {
      method: "GET",
      cache: "no-store",
    });
    const data = await res.json();
    cachedValue = data.maintenance as boolean;
    lastFetched = now;
    return cachedValue;
  } catch (err) {
    console.error("Maintenance check failed:", err);
    cachedValue = false;
    return false;
  }
}
