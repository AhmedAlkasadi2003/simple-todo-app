/**
 * API Error Handling & Normalization
 *
 * Provides a standard error class and safe conversion helpers so UI components
 * always deal with a predictable, user-friendly error structure.
 */

export interface ValidationErrorDetails {
  [fieldName: string]: string[];
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: ValidationErrorDetails;
  public readonly isNetworkError: boolean;

  constructor(params: {
    message: string;
    status?: number;
    code?: string;
    details?: ValidationErrorDetails;
    isNetworkError?: boolean;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status ?? 500;
    this.code = params.code ?? "UNKNOWN_ERROR";
    this.details = params.details;
    this.isNetworkError = Boolean(params.isNetworkError);

    // Maintain proper prototype chain in transpiled TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Type guard to check if an unknown error is an instance of ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Normalizes any caught error (Network, TypeError, generic Error, or unknown)
 * into a structured ApiError instance.
 */
export function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  // Handle standard AbortError
  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError({
      message: "Request was cancelled.",
      status: 0,
      code: "REQUEST_ABORTED",
    });
  }

  // Handle browser network failures (e.g., server offline, CORS blocked)
  if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
    return new ApiError({
      message:
        "Unable to connect to the server. Please ensure the backend is running and CORS is configured.",
      status: 0,
      code: "NETWORK_ERROR",
      isNetworkError: true,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message || "An unexpected error occurred.",
      status: 500,
      code: "CLIENT_ERROR",
    });
  }

  return new ApiError({
    message: "An unknown error occurred. Please try again.",
    status: 500,
    code: "UNKNOWN_ERROR",
  });
}
