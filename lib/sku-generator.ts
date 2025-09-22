export function generateUniqueSKU(): string {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const random = Math.random().toString(36).substring(2, 8); // Random string
  return `SKU-${timestamp}-${random}`.toUpperCase();
}