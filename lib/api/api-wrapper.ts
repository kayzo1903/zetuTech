/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/api-wrapper.ts
import { NextRequest, NextResponse } from "next/server";
import { ErrorHandler, ApiResponse } from "./error-handler";

// API Handler wrapper for consistent error handling
export function withErrorHandling<T = any>(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  };
}

// API Handler wrapper with authentication
export function withAuth<T = any>(
  handler: (request: NextRequest, user: any, ...args: any[]) => Promise<NextResponse<ApiResponse<T>>>,
  requireAdmin = false
) {
  return withErrorHandling(async (request: NextRequest, ...args: any[]) => {
    const { getServerSession } = await import("@/lib/server-session");
    const { requireAuth } = await import("./error-handler");

    const { session } = await getServerSession();
    const user = await requireAuth(session, requireAdmin);

    return handler(request, user, ...args);
  });
}

// API Handler wrapper with validation
export function withValidation<T = any>(
  schema: any,
  handler: (request: NextRequest, validatedData: T, ...args: any[]) => Promise<NextResponse<ApiResponse<T>>>
) {
  return withErrorHandling(async (request: NextRequest, ...args: any[]) => {
    const body = await request.json();
    const { validateInput } = await import("./error-handler");
    const validatedData = validateInput<T>(schema, body);

    return handler(request, validatedData, ...args);
  });
}

// Combined wrapper for auth + validation
export function withAuthAndValidation<T = any>(
  schema: any,
  handler: (request: NextRequest, user: any, validatedData: T, ...args: any[]) => Promise<NextResponse<ApiResponse<T>>>,
  requireAdmin = false
) {
  return withErrorHandling(async (request: NextRequest, ...args: any[]) => {
    const { getServerSession } = await import("@/lib/server-session");
    const { requireAuth, validateInput } = await import("./error-handler");

    const { session } = await getServerSession();
    const user = await requireAuth(session, requireAdmin);

    const body = await request.json();
    const validatedData = validateInput<T>(schema, body);

    return handler(request, user, validatedData, ...args);
  });
} // ✅ This brace was missing

// Pagination helpers
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function getPaginationParams(request: NextRequest): PaginationParams {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

// Response helpers
export const ApiResponses = {
  success: ErrorHandler.success,
  error: ErrorHandler.error,

  created: <T>(data: T, message = "Resource created successfully") =>
    NextResponse.json({ success: true, data, message }, { status: 201 }),

  updated: <T>(data: T, message = "Resource updated successfully") =>
    NextResponse.json({ success: true, data, message }),

  deleted: (message = "Resource deleted successfully") =>
    NextResponse.json({ success: true, message }),

  paginated: <T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }
  ) =>
    NextResponse.json({
      success: true,
      data,
      meta: { pagination },
    }),
};
