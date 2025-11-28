// utils/parsers.ts
export const safeJsonParse = <T>(value: unknown, fallback: T): T => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value as T;

  try {
    return typeof value === "string" ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
