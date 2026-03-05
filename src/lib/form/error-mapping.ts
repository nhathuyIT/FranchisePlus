import type { FieldValues, UseFormSetError, Path } from "react-hook-form";

/**
 * API error item structure (matches backend response)
 */
export interface ApiErrorItem {
  message: string;
  field: string;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string | null;
  errors: ApiErrorItem[];
}

/**
 * API success response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string | null;
  data: T;
}

/**
 * Generic API response type
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Check if response is an error response
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as ApiErrorResponse).success === false &&
    "errors" in response &&
    Array.isArray((response as ApiErrorResponse).errors)
  );
}

/**
 * Map API errors to React Hook Form field errors
 *
 * @param apiResponse - The error response from API
 * @param setError - React Hook Form's setError function
 * @param fieldLabelMap - Optional map of field names to labels for better error messages
 *
 * @example
 * ```tsx
 * const { setError } = useForm();
 *
 * try {
 *   await createFranchise(data);
 * } catch (error) {
 *   if (isApiError(error)) {
 *     mapApiErrorsToForm(error, setError);
 *   }
 * }
 * ```
 */
export function mapApiErrorsToForm<TFormData extends FieldValues>(
  apiResponse: ApiErrorResponse,
  setError: UseFormSetError<TFormData>,
  fieldLabelMap?: Record<string, string>
): void {
  // Map each field error
  apiResponse.errors.forEach((err) => {
    // Check if field exists in form (basic validation)
    const fieldName = err.field as Path<TFormData>;

    // Enhance message with field label if available
    const label = fieldLabelMap?.[err.field];
    const message = label
      ? err.message.replace(err.field, label)
      : err.message;

    setError(fieldName, {
      type: "server",
      message,
    });
  });

  // If there's a general message, set it as root error
  if (apiResponse.message) {
    setError("root.serverError" as Path<TFormData>, {
      type: "server",
      message: apiResponse.message,
    });
  }
}

/**
 * Extract field errors from API response
 * Returns a map of field name to error message
 */
export function extractFieldErrors(
  apiResponse: ApiErrorResponse
): Record<string, string> {
  const errors: Record<string, string> = {};

  apiResponse.errors.forEach((err) => {
    errors[err.field] = err.message;
  });

  return errors;
}

/**
 * Get the first error message from API response
 * Useful for toast notifications
 */
export function getFirstErrorMessage(
  apiResponse: ApiErrorResponse
): string {
  // Prefer general message
  if (apiResponse.message) {
    return apiResponse.message;
  }

  // Fall back to first field error
  if (apiResponse.errors.length > 0) {
    return apiResponse.errors[0].message;
  }

  return "An unknown error occurred";
}

/**
 * Parse error from various sources (Axios, fetch, API response)
 */
export function parseError(error: unknown): ApiErrorResponse {
  // Already an API error response
  if (isApiError(error)) {
    return error;
  }

  // Axios error with response data
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const axiosError = error as { response?: { data?: unknown } };
    if (axiosError.response?.data && isApiError(axiosError.response.data)) {
      return axiosError.response.data;
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      errors: [],
    };
  }

  // String error
  if (typeof error === "string") {
    return {
      success: false,
      message: error,
      errors: [],
    };
  }

  // Unknown error
  return {
    success: false,
    message: "An unexpected error occurred",
    errors: [],
  };
}

/**
 * Categorize errors by severity
 */
export interface CategorizedErrors {
  fieldErrors: Record<string, string>;
  generalError: string | null;
  validationErrors: string[];
  serverErrors: string[];
}

export function categorizeErrors(
  apiResponse: ApiErrorResponse
): CategorizedErrors {
  const result: CategorizedErrors = {
    fieldErrors: {},
    generalError: apiResponse.message,
    validationErrors: [],
    serverErrors: [],
  };

  apiResponse.errors.forEach((err) => {
    if (err.field) {
      result.fieldErrors[err.field] = err.message;
      result.validationErrors.push(err.message);
    } else {
      result.serverErrors.push(err.message);
    }
  });

  return result;
}
