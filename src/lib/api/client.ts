import { ApiError } from "./errors";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | undefined>;
}

/**
 * Reusable HTTP client built on top of native `fetch`.
 * Handles headers, JSON serialization/deserialization, 204 No Content,
 * and robust error normalization.
 */
export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, body, signal, ...restOptions } = options;

  // Build URL with query parameters if provided
  let targetUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value);
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      targetUrl += (targetUrl.includes("?") ? "&" : "?") + queryString;
    }
  }

  const requestHeaders = new Headers(headers);
  if (body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Ensure JSON is accepted
  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      ...restOptions,
      headers: requestHeaders,
      body,
      signal,
    });
  } catch (err: unknown) {
    // If the request was aborted by an AbortController
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError({
        message: "Request cancelled.",
        status: 0,
        code: "REQUEST_ABORTED",
      });
    }

    // Network connection errors or CORS blocked
    throw new ApiError({
      message:
        "Failed to connect to the backend server. Please verify the backend is running at the configured URL.",
      status: 0,
      code: "NETWORK_ERROR",
      isNetworkError: true,
    });
  }

  // Handle 204 No Content or empty bodies (e.g. DELETE requests)
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    if (!response.ok) {
      throw new ApiError({
        message: `Request failed with status ${response.status}`,
        status: response.status,
        code: `HTTP_${response.status}`,
      });
    }
    return undefined as unknown as T;
  }

  // Attempt to parse JSON response body
  let responseData: unknown = null;
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (isJson) {
    try {
      responseData = await response.json();
    } catch {
      // Invalid JSON from server
      if (!response.ok) {
        throw new ApiError({
          message: `Server returned HTTP ${response.status} with an invalid JSON response.`,
          status: response.status,
          code: "INVALID_JSON_RESPONSE",
        });
      }
      throw new ApiError({
        message: "Server returned an invalid JSON response.",
        status: response.status,
        code: "INVALID_JSON_RESPONSE",
      });
    }
  } else {
    // Non-JSON response (e.g. plain text 404 or 500 from an unhandled proxy)
    const text = await response.text();
    if (!response.ok) {
      throw new ApiError({
        message: text.slice(0, 200) || `Request failed with status ${response.status}`,
        status: response.status,
        code: `HTTP_${response.status}`,
      });
    }
    return text as unknown as T;
  }

  // Handle HTTP error status codes (4xx, 5xx)
  if (!response.ok) {
    // Check if error matches our proposed { error: { code, message, details } } format
    if (
      responseData &&
      typeof responseData === "object" &&
      "error" in responseData &&
      responseData.error &&
      typeof responseData.error === "object"
    ) {
      const errObj = responseData.error as {
        code?: string;
        message?: string;
        details?: Record<string, string[]>;
      };

      throw new ApiError({
        message: errObj.message || `Request failed with status ${response.status}`,
        status: response.status,
        code: errObj.code || `HTTP_${response.status}`,
        details: errObj.details,
      });
    }

    // Fallback for standard error objects { message: "..." }
    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof (responseData as { message: unknown }).message === "string"
    ) {
      throw new ApiError({
        message: (responseData as { message: string }).message,
        status: response.status,
        code: `HTTP_${response.status}`,
      });
    }

    // Generic fallback for any other error structure
    throw new ApiError({
      message: `Request failed with status ${response.status}.`,
      status: response.status,
      code: `HTTP_${response.status}`,
    });
  }

  return responseData as T;
}
