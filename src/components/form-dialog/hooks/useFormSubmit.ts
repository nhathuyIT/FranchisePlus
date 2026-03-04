import { useState, useCallback } from "react";
import type { FieldValues, Path } from "react-hook-form";
import {
  parseError,
  mapApiErrorsToForm,
  isApiError,
} from "@/lib/form/error-mapping";
import type { UseFormSubmitProps, UseFormSubmitReturn } from "../types";

/**
 * Hook for handling form submission with error mapping
 *
 * Features:
 * - Handles async submission
 * - Maps API errors to form fields
 * - Manages loading and error states
 * - Focuses first field with error
 *
 * @example
 * ```tsx
 * const form = useForm<UserFormData>({ ... });
 * const { isSubmitting, generalError, handleSubmit } = useFormSubmit({
 *   form,
 *   onSubmit: async (data) => {
 *     const result = await createUser(data);
 *     return result;
 *   },
 *   onSuccess: () => {
 *     closeDialog();
 *     queryClient.invalidateQueries(['users']);
 *   },
 * });
 *
 * <form onSubmit={handleSubmit}>
 *   {generalError && <FormErrorBanner error={generalError} />}
 *   ...
 * </form>
 * ```
 */
export function useFormSubmit<TFormData extends FieldValues>({
  form,
  onSubmit,
  onSuccess,
  fieldLabelMap,
}: UseFormSubmitProps<TFormData>): UseFormSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const clearGeneralError = useCallback(() => {
    setGeneralError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      // Clear previous errors
      setGeneralError(null);

      // Use form.handleSubmit to trigger validation first
      await form.handleSubmit(async (data: TFormData) => {
        setIsSubmitting(true);

        try {
          const result = await onSubmit(data);

          // Handle explicit error result
          if (result && !result.success) {
            // Map field errors to form
            if (result.fieldErrors) {
              Object.entries(result.fieldErrors).forEach(([field, message]) => {
                form.setError(field as Path<TFormData>, {
                  type: "server",
                  message,
                });
              });

              // Focus first field with error
              const firstErrorField = Object.keys(result.fieldErrors)[0];
              if (firstErrorField) {
                form.setFocus(firstErrorField as Path<TFormData>);
              }
            }

            // Set general error
            if (result.error) {
              setGeneralError(result.error);
            }

            return;
          }

          // Success - call success handler
          onSuccess?.();
        } catch (error: unknown) {
          // Parse and handle error
          const parsedError = parseError(error);

          if (isApiError(error) || parsedError.errors.length > 0) {
            // Map API errors to form fields
            mapApiErrorsToForm(parsedError, form.setError, fieldLabelMap);

            // Focus first field with error
            if (parsedError.errors.length > 0) {
              const firstErrorField = parsedError.errors[0].field;
              if (firstErrorField) {
                form.setFocus(firstErrorField as Path<TFormData>);
              }
            }
          }

          // Set general error message
          if (parsedError.message) {
            setGeneralError(parsedError.message);
          }
        } finally {
          setIsSubmitting(false);
        }
      })(e);
    },
    [form, onSubmit, onSuccess, fieldLabelMap]
  );

  return {
    isSubmitting,
    generalError,
    handleSubmit,
    clearGeneralError,
  };
}
