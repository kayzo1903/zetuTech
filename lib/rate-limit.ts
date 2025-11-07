import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval?: number; // Max unique tokens to track
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval,
  });

  return {
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) || 0) + 1;
      tokenCache.set(token, tokenCount);

      const currentUsage = tokenCount;
      const isRateLimited = currentUsage > limit;

      return {
        isRateLimited,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': isRateLimited ? '0' : (limit - currentUsage).toString(),
        },
      };
    },
  };
}

// Global rate limiters for different endpoints
export const globalRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000,
});

export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

export const orderRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});