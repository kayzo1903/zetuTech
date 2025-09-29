// lib/api/wishlist.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Get user's wishlist with items
export async function getWishlist() {
  return apiCall('/api/wishlist');
}

// Toggle item in wishlist (add/remove)
export async function toggleWishlistItem(productId: string) {
  return apiCall('/api/wishlist/items', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

// Remove item from wishlist
export async function removeWishlistItem(productId: string) {
  return apiCall(`/api/wishlist/items?productId=${productId}`, {
    method: 'DELETE',
  });
}

// Check if product is in user's wishlist
export async function checkWishlistStatus(productId: string) {
  return apiCall(`/api/wishlist/items?productId=${productId}`);
}