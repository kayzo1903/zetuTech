/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// =========================
// ✅ Standard API Response Types
// =========================
export interface ApiSuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: any;
  code: ErrorCode;
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// =========================
// ✅ Error Codes
// =========================
export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_TOKEN = "INVALID_TOKEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  INVALID_OPERATION = "INVALID_OPERATION",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
}

// =========================
// ✅ Error Status Map
// =========================
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.INVALID_TOKEN]: 401,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.INVALID_INPUT]: 400,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.ALREADY_EXISTS]: 409,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.INSUFFICIENT_STOCK]: 400,
  [ErrorCode.INVALID_OPERATION]: 400,
  [ErrorCode.PAYMENT_FAILED]: 402,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
  [ErrorCode.RATE_LIMITED]: 429,
};

// =========================
// ✅ Custom Error Class
// =========================
export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: ErrorCode = ErrorCode.INTERNAL_ERROR, details?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = ERROR_STATUS_MAP[code];
    this.details = details;
  }
}

// =========================
// ✅ Error Handler Class
// =========================
export class ErrorHandler {
  static handle(error: unknown): NextResponse<ApiErrorResponse> {
    if (process.env.NODE_ENV !== "production") {
      console.error("API Error:", error);
    }

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          timestamp: new Date().toISOString(),
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          code: ErrorCode.VALIDATION_ERROR,
          details: error.issues,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    if (error && typeof error === "object" && "code" in error) {
      const dbError = error as any;
      if (dbError.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "Resource already exists",
            code: ErrorCode.ALREADY_EXISTS,
            details: dbError.detail,
            timestamp: new Date().toISOString(),
          },
          { status: 409 }
        );
      }

      if (dbError.code === "23503") {
        return NextResponse.json(
          {
            success: false,
            error: "Referenced resource not found",
            code: ErrorCode.NOT_FOUND,
            details: dbError.detail,
            timestamp: new Date().toISOString(),
          },
          { status: 404 }
        );
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: ErrorCode.INTERNAL_ERROR,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  static success<T>(data?: T, message?: string, meta?: ApiSuccessResponse<T>["meta"]) {
    return NextResponse.json({ success: true, data, message, meta });
  }

  static error(message: string, code: ErrorCode = ErrorCode.INTERNAL_ERROR, details?: any) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code,
        details,
        timestamp: new Date().toISOString(),
      },
      { status: ERROR_STATUS_MAP[code] }
    );
  }
}

// =========================
// ✅ Convenience Error Helpers
// =========================
export const ApiErrors = {
  unauthorized: (message = "Unauthorized access") => new ApiError(message, ErrorCode.UNAUTHORIZED),
  forbidden: (message = "Access forbidden") => new ApiError(message, ErrorCode.FORBIDDEN),
  notFound: (resource = "Resource") => new ApiError(`${resource} not found`, ErrorCode.NOT_FOUND),
  validationError: (message = "Validation failed", details?: any) =>
    new ApiError(message, ErrorCode.VALIDATION_ERROR, details),
  insufficientStock: (productName?: string) =>
    new ApiError(
      productName ? `Insufficient stock for ${productName}` : "Insufficient stock",
      ErrorCode.INSUFFICIENT_STOCK
    ),
  invalidOperation: (message = "Invalid operation") =>
    new ApiError(message, ErrorCode.INVALID_OPERATION),
  paymentFailed: (message = "Payment processing failed") =>
    new ApiError(message, ErrorCode.PAYMENT_FAILED),
  databaseError: (message = "Database operation failed") =>
    new ApiError(message, ErrorCode.DATABASE_ERROR),
  externalServiceError: (service: string) =>
    new ApiError(`${service} service unavailable`, ErrorCode.EXTERNAL_SERVICE_ERROR),
};

// =========================
// ✅ Authentication & Validation Helpers
// =========================
export async function requireAuth(session: any, isAdmin = false) {
  if (!session?.user) throw ApiErrors.unauthorized();
  if (isAdmin && session.user.role !== "admin") throw ApiErrors.forbidden("Admin access required");
  return session.user;
}

export function validateInput<T>(schema: any, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw ApiErrors.validationError("Validation failed", error.issues);
    }
    throw error;
  }
}

export async function requireResourceExists<T>(
  resource: T | null | undefined,
  resourceName = "Resource"
): Promise<T> {
  if (!resource) throw ApiErrors.notFound(resourceName);
  return resource;
}
